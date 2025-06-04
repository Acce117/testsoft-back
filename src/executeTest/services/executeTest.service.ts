import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PsiTestService } from 'src/psiTest/services/psiTest.service';
import { TestApplicationService } from './testApplication.service';
import { ExecuteTestDto } from '../dto/executeTest.dto';
import { PsiTest } from 'src/psiTest/models/psiTest.entity';
import { TestSerie } from 'src/psiTest/models/testSerie.entity';
import { Question } from 'src/psiTest/models/question.entity';
import { ApplicationAnswerService } from './applicationAnswer.service';
import { ApplicationAnswerValueService } from './applicationAnswerValue.service';
import { TestApplication } from '../models/testApplication.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { TributeService } from 'src/psiTest/services/tribute.service';
import { Tribute } from 'src/psiTest/models/tribute.entity';
import { EquationService } from 'src/psiTest/services/equation.service';
import { Item } from 'src/psiTest/models/item.entity';
import { ApplicationResultService } from './appResult.service';
import {
    MULTIPLE_OPTION_ALL_OR_NOTHING,
    MULTIPLE_OPTIONS_VALUE_ASSIGN,
    multipleOptionTypes,
    SIMPLE_OPTION,
    simpleOptionTypes,
    valueAnswerTypes,
    WRITTEN_ANSER,
    WRITTEN_ANSER_ALL_OR_NOTHING,
    writtenAnswerTypes,
} from './appAnswerHandler/valueAnswerHandler';
import { FinalAnswers, ValueAnswer } from '../classes/finalAnswers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
@Injectable()
export class ExecuteTestService {
    @Inject(TestApplicationService) testAppService: TestApplicationService;

    @Inject(PsiTestService) psiTestService: PsiTestService;

    @Inject(ApplicationAnswerService)
    applicationAnswerService: ApplicationAnswerService;

    @Inject(ApplicationAnswerValueService)
    applicationAnswerValueService: ApplicationAnswerValueService;

    @Inject(TributeService)
    tributeService: TributeService;

    @Inject(EquationService)
    equationService: EquationService;

    @Inject(ApplicationResultService)
    appResultService: ApplicationResultService;

    @InjectDataSource()
    dataSource: DataSource;

    @Inject(CACHE_MANAGER) cacheManager: Cache;

    public async executeTest(
        data: ExecuteTestDto,
        start_time_key,
        manager: EntityManager,
    ) {
        const start_time: number = await this.cacheManager.get(start_time_key);
        await this.cacheManager.del(start_time_key);

        if (start_time === null)
            throw new BadRequestException('Start time key is invalid');

        const execution_time = (Date.now() - start_time) * 60000;

        const test: PsiTest = await this.psiTestService.getOne(
            {
                select: [
                    'test.id_test',
                    'test.time_duration',
                    'test.completed',
                ],
                relations: ['series.questions.type'],
            },
            data.id_test,
        );

        // await this.validateTest(data, test);
        const { testApplication, finalAnswers } = await this.processAnswers(
            data,
            execution_time,
            test,
            manager,
        );
        await this.processResult(testApplication, finalAnswers, manager);
        return testApplication;
    }

    async getResult(id_test_app) {
        const testApp = await this.testAppService.getOne(
            {
                relations: [
                    'test.display_parameters',
                    {
                        name: 'application_result',
                        relations: [
                            {
                                name: 'item',
                                relations: ['ranges', 'category'],
                            },
                        ],
                    },
                ],
            },
            id_test_app,
        );

        return await this.testResult(testApp);
    }

    private async validateTest(data: ExecuteTestDto, test: PsiTest) {
        if (test.completed) {
            let is_complete: boolean = true;
            const answers = data.answers;
            let i: number = 0;
            let j: number = 0;

            //TODO manage written answer type question
            while (is_complete && i < test.series.length) {
                const questions = test.series[i].questions;
                while (is_complete && j < questions.length) {
                    const answer = answers.find(
                        (answer) =>
                            answer.id_question === questions[j].id_question,
                    );
                    is_complete = answer !== undefined;

                    if (
                        is_complete &&
                        questions[j].type.name === MULTIPLE_OPTIONS_VALUE_ASSIGN
                    ) {
                        let value = 0;
                        for (const id_key in answer.answer as ValueAnswer)
                            value += answer.answer[id_key];
                        is_complete = value === answer.top_value;
                    }

                    j++;
                }
                j = 0;
                i++;
            }

            if (!is_complete)
                throw new BadRequestException('Test must be complete');
        }

        return test;
    }

    private async processAnswers(
        { user_id, id_test, group_id, answers }: ExecuteTestDto,
        execution_time: number,
        test: PsiTest,
        manager: EntityManager,
    ) {
        const testApplication: TestApplication =
            await this.testAppService.create(
                {
                    fk_id_user: user_id,
                    fk_id_test: id_test,
                    fk_id_group: group_id,
                    execution_time,
                },
                manager,
            );

        const finalAnswers: FinalAnswers = {};
        const series: TestSerie[] = test.series;
        let question: Question = null;

        const appAnswers = {
            value: [],
            not_value: [],
        };
        for (const answer of answers) {
            question = this.findQuestion(series, answer.id_question);

            if (!finalAnswers[`${question.type.name}`])
                finalAnswers[`${question.type.name}`] = {};

            if (
                multipleOptionTypes.find((type) => question.type.name === type)
            ) {
                finalAnswers[`${question.type.name}`][`${answer.id_question}`] =
                    answer.answer;

                for (const id_answer of answer.answer as Array<number>) {
                    appAnswers.not_value.push({
                        fk_id_test_aplication:
                            testApplication.id_test_application,
                        fk_id_answer: id_answer,
                    });
                }
            } else if (
                simpleOptionTypes.find((type) => question.type.name === type)
            ) {
                finalAnswers[`${question.type.name}`][`${answer.id_question}`] =
                    answer.answer;

                appAnswers.not_value.push({
                    fk_id_test_aplication: testApplication.id_test_application,
                    fk_id_answer: answer.answer,
                });
            } else if (
                valueAnswerTypes.find((type) => question.type.name === type)
            ) {
                const values = answer.answer;

                for (const ans in values as ValueAnswer) {
                    if (
                        !finalAnswers[`${question.type.name}`][
                            `${answer.id_question}`
                        ]
                    )
                        finalAnswers[`${question.type.name}`][
                            `${answer.id_question}`
                        ] = {};

                    finalAnswers[`${question.type.name}`][
                        `${answer.id_question}`
                    ][`${ans}`] = values[`${ans}`];

                    appAnswers.value.push({
                        fk_id_test_aplication:
                            testApplication.id_test_application,
                        fk_id_answer: ans,
                        value: values[`${ans}`],
                    });
                }
            } else if (
                writtenAnswerTypes.find((type) => question.type.name === type)
            ) {
                for (const fk_id_answer in answer.answer as ValueAnswer) {
                    const value = answer.answer[fk_id_answer];
                    finalAnswers[`${question.type.name}`][
                        `${answer.id_question}`
                    ] = { [fk_id_answer]: value };
                    appAnswers.value.push({
                        fk_id_test_aplication:
                            testApplication.id_test_application,
                        fk_id_answer,
                        value,
                    });
                }
            }
        }

        if (appAnswers.not_value.length != 0)
            await this.applicationAnswerService.create(
                appAnswers.not_value,
                manager,
            );
        if (appAnswers.value.length != 0)
            await this.applicationAnswerValueService.create(
                appAnswers.value,
                manager,
            );

        return { testApplication, finalAnswers };
    }

    async processResult(
        testApplication: TestApplication,
        finalAnswers: FinalAnswers,
        manager: EntityManager,
    ) {
        const accumulated = {};
        // let corrects = null;
        for (const type_question in finalAnswers) {
            if (type_question === MULTIPLE_OPTION_ALL_OR_NOTHING) {
                for (const id_question in finalAnswers[`${type_question}`]) {
                    const correctAnswers: Array<any> =
                        await this.findCorrectAnswers(id_question);

                    let i = 0;
                    let result = false;
                    while (!result && i < correctAnswers.length) {
                        if (
                            correctAnswers[i].text ===
                            finalAnswers[`${type_question}`][id_question][
                                correctAnswers[i++].fk_id_answer
                            ]
                        )
                            result = true;
                    }

                    for (const id_answer of finalAnswers[`${type_question}`][
                        `${id_question}`
                    ]) {
                        const tribute = await this.tributeService.getOne({
                            where: {
                                fk_id_answer: id_answer,
                            },
                        });

                        if (!accumulated[tribute.fk_id_item])
                            accumulated[tribute.fk_id_item] =
                                tribute.tribute_value;
                        else
                            accumulated[tribute.fk_id_item] +=
                                tribute.tribute_value;
                    }
                }
            } else if (type_question === WRITTEN_ANSER_ALL_OR_NOTHING) {
                for (const id_question in finalAnswers[`${type_question}`]) {
                    const correctAnswers: Array<any> =
                        await this.findCorrectAnswers(id_question);

                    if (correctAnswers) {
                        let i = 0;
                        let result = false;
                        while (!result && i < correctAnswers.length) {
                            if (
                                correctAnswers[i].text ===
                                finalAnswers[`${type_question}`][id_question][
                                    correctAnswers[i++].fk_id_answer
                                ]
                            )
                                result = true;
                        }
                        for (const id_answer in finalAnswers[
                            `${type_question}`
                        ][`${id_question}`]) {
                            const tribute = await this.tributeService.getOne({
                                where: {
                                    fk_id_answer: id_answer,
                                },
                            });

                            if (!accumulated[tribute.fk_id_item])
                                accumulated[tribute.fk_id_item] =
                                    tribute.tribute_value;
                            else
                                accumulated[tribute.fk_id_item] +=
                                    tribute.tribute_value;
                        }
                    }
                }
            } else if (type_question === SIMPLE_OPTION) {
                for (const id_question in finalAnswers[`${type_question}`]) {
                    // corrects = await this.findCorrectAnswers(id_question);
                    // const equation = await this.equationService.getOne({
                    //     where: {
                    //         fk_id_test: testApplication.fk_id_test,
                    //     },
                    // });

                    const answers =
                        finalAnswers[`${type_question}`][`${id_question}`];

                    if (typeof answers === 'number') {
                        const tribute: Tribute =
                            await this.tributeService.getOne({
                                where: {
                                    fk_id_answer: answers,
                                },
                            });

                        if (!accumulated[tribute.fk_id_item])
                            accumulated[tribute.fk_id_item] =
                                tribute.tribute_value;
                        else
                            accumulated[tribute.fk_id_item] +=
                                tribute.tribute_value;
                    }

                    // if (equation) {
                    //     //TODO
                    // }
                }
            } else if (type_question === MULTIPLE_OPTIONS_VALUE_ASSIGN) {
                for (const id_question in finalAnswers[`${type_question}`]) {
                    const answers =
                        finalAnswers[`${type_question}`][`${id_question}`];

                    for (const id_answer in answers) {
                        const tribute: Tribute =
                            await this.tributeService.getOne({
                                where: {
                                    fk_id_answer: id_answer,
                                },
                            });

                        if (!accumulated[tribute.fk_id_item])
                            accumulated[tribute.fk_id_item] =
                                answers[`${id_answer}`];
                        else
                            accumulated[tribute.fk_id_item] +=
                                answers[`${id_answer}`];
                    }
                }
            } else if (type_question === WRITTEN_ANSER) {
                const questions = finalAnswers[type_question];
                for (const id_question in questions) {
                    if (typeof questions[id_question] !== 'string') {
                        const correctAnswers: any[] =
                            await this.findCorrectAnswers(id_question);

                        if (correctAnswers) {
                            let i = 0;
                            let result = false;
                            while (!result && i < correctAnswers.length) {
                                if (
                                    correctAnswers[i].text ===
                                    questions[id_question][
                                        correctAnswers[i++].fk_id_answer
                                    ]
                                )
                                    result = true;
                            }

                            for (const id_answer in questions[
                                id_question
                            ] as ValueAnswer) {
                                const tribute =
                                    await this.tributeService.getOne({
                                        where: { fk_id_answer: id_answer },
                                    });

                                if (!accumulated[tribute.fk_id_item])
                                    accumulated[tribute.fk_id_item] =
                                        tribute.tribute_value;
                                else
                                    accumulated[tribute.fk_id_item] +=
                                        tribute.tribute_value;
                            }
                        }
                    }
                }
            }
        }

        //TODO save application result
        const app_result = [];
        for (const id_item in accumulated) {
            app_result.push({
                fk_item: id_item,
                fk_test_application: testApplication.id_test_application,
                value_result: accumulated[id_item],
            });
        }
        return this.appResultService.create(app_result, manager);
    }

    //TODO solve problems with ties in Belbin
    testResult(testApp: TestApplication) {
        const parameters = testApp.test.display_parameters;

        const final_results = { parameters };

        if (parameters.all_element_value) {
            if (parameters.tops_values) {
                const app_result = testApp.application_result;

                const items_ordered = this.mergeSort(
                    app_result.map((el) => ({
                        item: el.item,
                        value: el.value_result,
                    })),
                );

                final_results['preferred'] = [];
                //TODO deal with ties
                for (let i = 0; i < parameters.count_max; i++) {
                    final_results['preferred'].push(items_ordered[i]);
                }
                final_results['avoided'] = [];
                for (
                    let i = items_ordered.length - 1;
                    i >= items_ordered.length - parameters.count_min;
                    i--
                ) {
                    final_results['avoided'].push(items_ordered[i]);
                }
            } else {
                const app_result = testApp.application_result;

                const items_ordered = this.mergeSort(
                    app_result.map((el) => ({
                        item: el.item,
                        value: el.value_result,
                    })),
                );

                final_results['items'] = items_ordered;
            }
        } else if (parameters.element_by_category) {
            final_results['categories'] = {};

            const app_result = testApp.application_result;

            const items_ordered = this.mergeSort(
                app_result.map((el) => ({
                    item: el.item,
                    value: el.value_result,
                })),
            );

            for (let i = 0; i < items_ordered.length; i++) {
                const category_name = items_ordered[i].item.category.name;

                if (!final_results['categories'][[`${category_name}`]])
                    final_results['categories'][[`${category_name}`]] = {
                        ...items_ordered[i].item.category,
                        items: [],
                    };

                final_results['categories'][[`${category_name}`]].items.push({
                    ...items_ordered[i].item,
                    category: undefined,
                    value: items_ordered[i].value,
                });

                if (parameters.tops_values) {
                    if (
                        final_results['categories'][`${category_name}`].items
                            .length !== 0
                    ) {
                        const last_item_index =
                            final_results['categories'][`${category_name}`]
                                .items.length - 1;
                        if (
                            final_results['categories'][`${category_name}`]
                                .items[last_item_index].value ===
                            items_ordered[i].value
                        )
                            if (
                                final_results['categories'][`${category_name}`]
                                    .items[last_item_index].priority <
                                items_ordered[i].item.priority
                            )
                                final_results['categories'][
                                    `${category_name}`
                                ].items.pop();
                    }
                    const items_length =
                        final_results['categories'][[`${category_name}`]].items
                            .length;

                    if (items_length < parameters.count_max) {
                        final_results['categories'][
                            `${category_name}`
                        ].items.push({
                            ...items_ordered[i].item,
                            value: items_ordered[i].value,
                            category: undefined,
                        });
                    }
                }
            }
            // else {
            //     for (const app_result of items_ordered) {
            //         const item = app_result.item;
            //         const category = item.category.name;

            //         final_results[`${category}`] = {
            //             ...app_result.item.category,
            //             items: [{ ...app_result.item, category: undefined }],
            //             value: app_result.value,
            //         };
            //     }
            // }
        }

        return final_results;
    }

    private findQuestion(series, questionKey) {
        let question = null;
        let i: number = 0;

        while (!question && i < series.length) {
            question = series[i++].questions.find(
                (q) => q.id_question == questionKey,
            );
        }

        return question;
    }

    async findCorrectAnswers(id_question) {
        const correctByQuestion = await this.dataSource.query(`
                SELECT id_answer, text, answer.fk_id_question
                FROM answer
                INNER JOIN question ON answer.fk_id_question = question.id_question
                INNER JOIN correct_answer ON correct_answer.fk_id_answer = answer.id_answer
                WHERE question.id_question = ${id_question}
        `);

        return correctByQuestion;
    }

    private merge(
        left: { item: Item; value: number }[],
        right: { item: Item; value: number }[],
    ): { item: Item; value: number }[] {
        const resultArray: { item: Item; value: number }[] = [];

        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex].value >= right[rightIndex].value) {
                resultArray.push(left[leftIndex]);
                leftIndex++;
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
    }

    private mergeSort(
        unsortedArray: { item: Item; value: number }[],
    ): { item: Item; value: number }[] {
        if (unsortedArray.length <= 1) {
            return unsortedArray;
        }

        const middle = Math.floor(unsortedArray.length / 2);
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);

        return this.merge(this.mergeSort(left), this.mergeSort(right));
    }

    async testStarted() {
        const now = Date.now();
        const key = bcrypt.hashSync(now.toString(), 10);
        this.cacheManager.set(key, now);
        return key;
    }
}
