import { CrudBaseService } from 'src/common/services/service';
import { CorrectAnswer } from '../models/correctAnswer.entity';

export class CorrectAnswerService extends CrudBaseService({
    model: CorrectAnswer,
    delete: 'hard',
}) {}
