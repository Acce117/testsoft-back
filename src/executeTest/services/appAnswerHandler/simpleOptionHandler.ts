import { TestApplication } from 'src/executeTest/models/testApplication.entity';
import { AppAnswerHandler } from './appAnswerHandler';
import { ApplicationAnswerService } from '../applicationAnswer.service';
import { Inject } from '@nestjs/common';

class SimpleOptionHandler extends AppAnswerHandler {
    @Inject(ApplicationAnswerService)
    appAnswerService: ApplicationAnswerService;

    public readonly questionTypeAccepted: string[] = ['Opción Simple'];

    public manageApplicationAnswer(
        testApplication: TestApplication,
        answer: any,
    ) {
        return this.appAnswerService.create({
            fk_id_test_application: testApplication.id_test_application,
            fk_id_answer: answer.answer,
        });
    }
}

const simpleOption = new SimpleOptionHandler();

export default simpleOption;
