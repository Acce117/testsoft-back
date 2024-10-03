import { TestApplication } from 'src/executeTest/models/testApplication.entity';
import { AppAnswerHandler } from './appAnswerHandler';
import { Inject } from '@nestjs/common';
import { ApplicationAnswerValueService } from '../applicationAnswerValue.service';

class ValueAnswerHandler extends AppAnswerHandler {
    @Inject(ApplicationAnswerValueService)
    appAnswerValueService: ApplicationAnswerValueService;

    public readonly questionTypeAccepted: string[] = [
        'Opción Múltiple con asignación de valores',
        'Respuesta escrita',
        'Todo o nada respuesta escrita',
    ];

    public manageApplicationAnswer(
        testApplication: TestApplication,
        answer: any,
    ) {
        const appAnswers: Array<any> = [];

        answer.foreach((answer) => {
            appAnswers.push({
                fk_id_test_application: testApplication.id_test_application,
                fk_id_answer: answer.answer,
                value: answer,
            });
        });

        return this.appAnswerValueService.create(appAnswers);
    }
}

const valueAnswer = new ValueAnswerHandler();

export default valueAnswer;
