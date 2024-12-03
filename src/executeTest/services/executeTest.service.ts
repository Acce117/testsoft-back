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
import multipleOption from './appAnswerHandler/MultipleOptionHandler';
import simpleOption from './appAnswerHandler/simpleOptionHandler';
import valueAnswer from './appAnswerHandler/valueAnswerHandler';
import { AppAnswerHandler } from './appAnswerHandler/appAnswerHandler';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TributeService } from 'src/psiTest/services/tribute.service';
import { Tribute } from 'src/psiTest/models/tribute.entity';
import { EquationService } from 'src/psiTest/services/equation.service';

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
            data.answers,
            test,
        );
        return await this.processResult(testApplication, finalAnswers);
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
        answers: Array<{ [key: number]: any; id_question: number }>,
        test: PsiTest,
    ) {
        // const testApplication: TestApplication = this.testAppService.create({
        //     fk_id_user: data.user_id,
        //     fk_id_test: data.id_test,
        // });

        const finalAnswers = {};
        const series: TestSerie[] = test.series;
        let question: Question = null;

        for (const questionKey in answers) {
            question = this.findQuestion(
                series,
                answers[questionKey].id_question,
            );
            let handler: AppAnswerHandler = null;

            if (!finalAnswers[`${question.type.name}`])
                finalAnswers[`${question.type.name}`] = {};

            if (
                multipleOption.questionTypeAccepted.find(
                    (type) => question.type.name === type,
                )
            ) {
                handler = multipleOption;
            } else if (
                simpleOption.questionTypeAccepted.find(
                    (type) => question.type.name === type,
                )
            ) {
                handler = simpleOption;
                finalAnswers[`${question.type.name}`][
                    `${answers[`${questionKey}`].id_question}`
                ] = answers[`${questionKey}`].answer;
            } else if (
                valueAnswer.questionTypeAccepted.find(
                    (type) => question.type.name === type,
                )
            ) {
                handler = valueAnswer;
            }

            // handler.manageApplicationAnswer(
            //     testApplication,
            //     data.answers[questionKey],
            // );
        }

        return { testApplication: null, finalAnswers };
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
        testApplication: TestApplication,
        finalAnswers: object,
    ) {
        const accumulated = {};
        let corrects = null;
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

                    if (equation) {
                        //TODO
                    }
                }
            }
        }

        //TODO save application result
        return accumulated;
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
}
