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

@Injectable()
export class ExecuteTestService {
    @Inject(TestApplicationService) testAppService: TestApplicationService;

    @Inject(PsiTestService) psiTestService: PsiTestService;

    @Inject(ApplicationAnswerService)
    applicationAnswerService: ApplicationAnswerService;

    @Inject(ApplicationAnswerValueService)
    applicationAnswerValueService: ApplicationAnswerValueService;

    public executeTest(data: ExecuteTestDto) {
        const test: PsiTest = this.psiTestService.getOne(
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

        this.validateTest(data, test);
        const testApplication = this.processAnswers(data, test);
        return this.processResult(testApplication);
    }

    private validateTest(data: ExecuteTestDto, test: PsiTest) {
        if (test.completed) {
            let is_complete: boolean = true;
            const answers = data.answers;
            let i: number = 0;
            let j: number = 0;

            //TODO manage written answer type question
            while (is_complete && i < test.series.length) {
                const questions = test.series[i].questions;
                j = questions.length;
                while (is_complete && j < questions.length) {
                    is_complete = questions[j].id_question in answers;
                    j++;
                }
                i++;
            }

            if (!is_complete)
                throw new BadRequestException('Test must be complete');
        }

        return test;
    }

    private processAnswers(data: ExecuteTestDto, test: PsiTest) {
        const testApplication: TestApplication = this.testAppService.create({
            fk_id_user: data.user_id,
            fk_id_test: data.id_test,
        });

        const series: TestSerie[] = test.series;
        let question: Question = null;

        // eslint-disable-next-line prefer-const
        for (let questionKey in data.answers) {
            question = this.findQuestion(series, questionKey);
            let handler: AppAnswerHandler = null;

            if (question.type.name in multipleOption.questionTypeAccepted) {
                handler = multipleOption;
            } else if (
                question.type.name in simpleOption.questionTypeAccepted
            ) {
                handler = simpleOption;
            } else if (question.type.name in valueAnswer.questionTypeAccepted) {
                handler = valueAnswer;
            }

            handler.manageApplicationAnswer(
                testApplication,
                data.answers[questionKey],
            );
        }

        return testApplication;
    }

    private findQuestion(series, questionKey) {
        let question = null;
        let i: number = 0;

        while (question || i < series.length) {
            question = series[i++].questions.find(
                (q) => q.id_question == (questionKey as unknown as number),
            );
        }

        return question;
    }

    processResult(testApplication: TestApplication) {
        return testApplication;
    }
}
