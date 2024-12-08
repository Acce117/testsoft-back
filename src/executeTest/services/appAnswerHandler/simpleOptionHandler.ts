import { TestApplication } from 'src/executeTest/models/testApplication.entity';
import { AppAnswerHandler } from './appAnswerHandler';
import { ApplicationAnswerService } from '../applicationAnswer.service';
import { Inject } from '@nestjs/common';
import { InsertResult } from 'typeorm';

export class SimpleOptionHandler extends AppAnswerHandler {
    public static questionTypeAccepted: string[] = ['Opción Simple'];

    constructor (private service) {
        super();
    }

    public manageApplicationAnswer(
        testApplication: InsertResult,
        answer: any,
    ) {
        const id_test_application = testApplication.identifiers[0].id_test_application;
        return this.service.create({
            fk_id_test_aplication: id_test_application,
            fk_id_answer: answer.answer,
        });
    }
}
