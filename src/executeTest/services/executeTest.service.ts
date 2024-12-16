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
import { DataSource, InsertResult } from 'typeorm';
import { TributeService } from 'src/psiTest/services/tribute.service';
import { Tribute } from 'src/psiTest/models/tribute.entity';
import { EquationService } from 'src/psiTest/services/equation.service';
import { ApplicationResult } from '../models/applicationResult.entity';
import { Item } from 'src/psiTest/models/item.entity';
import { ApplicationResultService } from './appResult.service';
import {
    multipleOptionTypes,
    simpleOptionTypes,
    valueAnswerTypes,
} from './appAnswerHandler/valueAnswerHandler';

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

    public async executeTest(data: ExecuteTestDto) {
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

        await this.validateTest(data, test);
        const { testApplication, finalAnswers } = await this.processAnswers(
            data,
            test,
        );
        await this.processResult(testApplication, finalAnswers);
        return (testApplication as InsertResult).identifiers[0]
            .id_test_application;
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
                            (answer.id_question = questions[j].id_question),
                    );

                    is_complete = answer !== null;
                    j++;
                }
                i++;
            }

            if (!is_complete)
                throw new BadRequestException('Test must be complete');
        }

        return test;
    }

    private async processAnswers(
        { user_id, id_test, answers }: ExecuteTestDto,
        test: PsiTest,
    ) {
        const testApplication: InsertResult | TestApplication =
            await this.testAppService.create({
                fk_id_user: user_id,
                fk_id_test: id_test,
            });

        const finalAnswers = {};
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
                //TODO
            } else if (
                simpleOptionTypes.find((type) => question.type.name === type)
            ) {
                finalAnswers[`${question.type.name}`][`${answer.id_question}`] =
                    answer.answer;

                appAnswers.not_value.push({
                    fk_id_test_aplication: (testApplication as InsertResult)
                        .raw[0].id_test_application,
                    fk_id_answer: answer.answer,
                });
            } else if (
                valueAnswerTypes.find((type) => question.type.name === type)
            ) {
                const values = answer.answer;

                for (const ans in values) {
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
                        fk_id_test_aplication: (testApplication as InsertResult)
                            .raw[0].id_test_application,
                        fk_id_answer: ans,
                        value: values[`${ans}`],
                    });
                }
            }
        }

        if (appAnswers.not_value.length != 0)
            this.applicationAnswerService.create(appAnswers.not_value);
        if (appAnswers.value.length != 0)
            this.applicationAnswerValueService.create(appAnswers.value);

        return { testApplication, finalAnswers };
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

    async processResult(
        testApplication: TestApplication | InsertResult,
        finalAnswers: object,
    ) {
        const accumulated = {};
        // let corrects = null;
        for (const type_question in finalAnswers) {
            if (type_question === 'Opción Simple') {
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
            } else if (
                type_question === 'Opción Múltiple con asignación de valores'
            ) {
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
            }
        }

        //TODO save application result
        const app_result = [];
        for (const id_item in accumulated) {
            app_result.push({
                fk_item: id_item,
                fk_test_application: (testApplication as InsertResult)
                    .identifiers[0].id_test_application,
                value_result: accumulated[id_item],
            });
        }
        await this.appResultService.create(app_result);
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

    //TODO solve problems with ties
    async testResult(testApp: TestApplication) {
        const parameters = testApp.test.display_parameters;

        const final_results = { parameters };

        if (parameters.all_element_value) {
            if (parameters.tops_values) {
                const app_result = testApp.application_result;
                const items_ordered = this.top(
                    app_result,
                    (val1, val2) => val1 < val2,
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
            }
        } else if (parameters.element_by_category)
            if (parameters.tops_values) {
                final_results['categories'] = {};

                const app_result = testApp.application_result;
                const items_ordered = this.top(
                    app_result,
                    (val1, val2) => val1 < val2,
                );

                for (let i = 0; i < items_ordered.length; i++) {
                    const category_name = items_ordered[i].item.category.name;

                    if (!final_results['categories'][[`${category_name}`]])
                        final_results['categories'][[`${category_name}`]] = {
                            ...items_ordered[i].item.category,
                            items: [],
                        };

                    const items_length =
                        final_results['categories'][[`${category_name}`]].items
                            .length;

                    if (items_length < parameters.count_max)
                        final_results['categories'][
                            `${category_name}`
                        ].items.push({
                            ...items_ordered[i].item,
                            value: items_ordered[i].value,
                            category: undefined,
                        });
                }
            }

        return final_results;
    }

    top(results: Array<ApplicationResult>, condition) {
        let items: Array<{ item: Item; value: number }> = [];

        for (let i = 0; i < results.length; i++) {
            if (items.length === 0)
                items.push({
                    item: results[i].item,
                    value: results[i].value_result,
                });
            else if (
                condition(
                    items[items.length - 1].value,
                    results[i].value_result,
                )
            )
                items = [
                    { item: results[i].item, value: results[i].value_result },
                    ...items,
                ];
            else
                items = [
                    ...items,
                    { item: results[i].item, value: results[i].value_result },
                ];
        }

        return items;
    }
}
