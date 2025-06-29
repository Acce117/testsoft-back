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
import { ApplicationResult } from '../models/applicationResult.entity';
import * as mathjs from 'mathjs';
import { ClassificationService } from 'src/psiTest/services/classification.service';
import { Tribute } from 'src/psiTest/models/tribute.entity';
@Injectable()
export class ExecuteTestService {
    @Inject(ClassificationService) classificationService: ClassificationService;
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

        // if (start_time === null)
        //     throw new BadRequestException('Start time key is invalid');

        const execution_time = (Date.now() - start_time) / 1000;

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
                    {
                        name: 'test',
                        relations: ['display_parameters', 'equation'],
                    },
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

        const tribute_ids = [];
        for (const type_question in finalAnswers) {
            for (const id_question in finalAnswers[`${type_question}`]) {
                if (type_question === MULTIPLE_OPTION_ALL_OR_NOTHING) {
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
                } else if (type_question === WRITTEN_ANSER_ALL_OR_NOTHING) {
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
                    }
                } else if (type_question === SIMPLE_OPTION) {
                    // corrects = await this.findCorrectAnswers(id_question);
                    // const equation = await this.equationService.getOne({
                    //     where: {
                    //         fk_id_test: testApplication.fk_id_test,
                    //     },
                    // });

                    finalAnswers[`${type_question}`][`${id_question}`];

                    // if (equation) {
                    //     //TODO
                    // }
                } else if (type_question === MULTIPLE_OPTIONS_VALUE_ASSIGN) {
                } else if (type_question === WRITTEN_ANSER) {
                    if (
                        typeof finalAnswers[`${type_question}`][id_question] !==
                        'string'
                    ) {
                        const correctAnswers: any[] =
                            await this.findCorrectAnswers(id_question);

                        if (correctAnswers) {
                            let i = 0;
                            let result = false;
                            while (!result && i < correctAnswers.length) {
                                if (
                                    correctAnswers[i].text ===
                                    finalAnswers[`${type_question}`][
                                        id_question
                                    ][correctAnswers[i++].fk_id_answer]
                                )
                                    result = true;
                            }
                        }
                    }
                }

                await this.manageAccumulated(
                    tribute_ids,
                    finalAnswers,
                    type_question,
                    id_question,
                );
            }
        }

        const tributes = await this.tributeService.getAll({
            relations: ['answer.question.type'],
            where: tribute_ids,
        });

        tributes.forEach((t: Tribute) => {
            const question = t.answer.question;
            const type = question.type.name;

            const answers = finalAnswers[`${type}`][`${question.id_question}`];

            const value =
                type === MULTIPLE_OPTIONS_VALUE_ASSIGN
                    ? answers[`${t.answer.id_answer}`]
                    : t.tribute_value;

            if (!accumulated[t.fk_id_item]) {
                accumulated[t.fk_id_item] = value;
            } else {
                accumulated[t.fk_id_item] += value;
            }
        });

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

    private async manageAccumulated(
        tribute_ids,
        finalAnswers,
        type_question,
        id_question,
    ) {
        const answers = finalAnswers[`${type_question}`][`${id_question}`];

        if (type_question === SIMPLE_OPTION) tribute_ids.push(answers);
        else if (type_question === MULTIPLE_OPTIONS_VALUE_ASSIGN)
            for (const id_answer in answers) tribute_ids.push(id_answer);
        else for (const id_answer of answers) tribute_ids.push(id_answer);
    }

    async testResult(testApp: TestApplication) {
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

                let items_length = 0;
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
                    items_length =
                        final_results['categories'][[`${category_name}`]].items
                            .length;
                }
                if (
                    items_length < parameters.count_max ||
                    parameters.count_max == 0
                ) {
                    final_results['categories'][`${category_name}`].items.push({
                        ...items_ordered[i].item,
                        value: items_ordered[i].value,
                        category: undefined,
                    });
                }
            }
        }

        if (parameters.global_result) {
            if (testApp.test.equation) {
                const appResults: ApplicationResult[] =
                    testApp.application_result;

                const data = {
                    c: 0,
                    i: 0,
                    o: 0,
                    r: 0,
                };

                await this.defineDataGlobalResult(data, appResults, testApp);
                const result = this.evaluateData(
                    testApp.test.equation.equation,
                    data,
                );

                const classification = await this.classificationService.getOne({
                    relations: ['ranges'],
                    where: {
                        fk_id_test: testApp.test.id_test,
                    },
                });

                const range = classification.ranges.find((range) => {
                    return range.min_val < result && result <= range.max_val;
                });

                final_results['global_result'] = {
                    classification: classification.name_classification,
                    indicator: range ? range.indicator : 'out of ranges',
                    result,
                };
            }
        }

        return final_results;
    }

    evaluateData(
        expr: string,
        data: { c: number; i: number; o: number; r: number },
    ): any {
        const node = mathjs.parse(expr);
        return node.compile().evaluate(data);
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

    async defineDataGlobalResult(
        data,
        appResults: Array<ApplicationResult>,
        testApp: TestApplication,
    ) {
        const appAnswer = await this.applicationAnswerService.getAll({
            where: {
                fk_id_test_aplication: testApp.id_test_application,
            },
            relations: ['answer.correct_answer'],
        });

        const appAnswerValue = await this.applicationAnswerValueService.getAll({
            where: {
                fk_id_test_aplication: testApp.id_test_application,
            },
            relations: ['answer.correct_answer'],
        });

        const answers = [...appAnswer, ...appAnswerValue];

        appResults.forEach((appResult) => {
            switch (appResult.item.name) {
                case 'correctas':
                    data.c += appResult.value_result;
                    break;
                case 'incorrectas':
                    data.i += appResult.value_result;
                    break;
            }
        });

        answers.forEach((a: { answer: { correct_answer: any } }) => {
            if (!a.answer.correct_answer) data.o++;
        });

        data.r = answers.length;
    }
}
