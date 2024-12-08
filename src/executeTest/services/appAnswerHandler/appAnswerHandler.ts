import { TestApplication } from 'src/executeTest/models/testApplication.entity';
import { InsertResult } from 'typeorm';

export abstract class AppAnswerHandler {
    private static instance: AppAnswerHandler;

    public static questionTypeAccepted: Array<string>;

    public abstract manageApplicationAnswer(
        testApplication: InsertResult,
        answer: any,
    );
}
