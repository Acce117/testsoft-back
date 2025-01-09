import { CrudBaseController } from 'src/common/controllers/controller';
import { CorrectAnswerService } from '../services/correctAnswer.service';

export class CorrectAnswerController extends CrudBaseController({
    prefix: 'correct_answer',
    service: CorrectAnswerService,
}) {}
