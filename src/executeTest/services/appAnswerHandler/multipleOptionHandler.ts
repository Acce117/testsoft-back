import { TestApplication } from 'src/executeTest/models/testApplication.entity';
import { AppAnswerHandler } from './appAnswerHandler';

class MultipleOptionHandler extends AppAnswerHandler {
    public readonly questionTypeAccepted: string[] = [
        'Opción Múltiple',
        'Todo o nada selección múltiple',
    ];

    public manageApplicationAnswer(
        testApplication: TestApplication,
        answer: any,
    ) {
        throw new Error('Method not implemented.');
    }
}

const multipleOption = new MultipleOptionHandler();

export default multipleOption;
