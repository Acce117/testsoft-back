import { TestApplication } from 'src/executeTest/models/testApplication.entity';

export abstract class AppAnswerHandler {
    private static instance: AppAnswerHandler;

    public readonly questionTypeAccepted: Array<string>;

    public abstract manageApplicationAnswer(
        testApplication: TestApplication,
        answer: any,
    );
}
