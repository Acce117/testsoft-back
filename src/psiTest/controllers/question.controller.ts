import { CrudBaseController } from 'src/common/controllers/controller';
import { QuestionService } from '../services/question.service';

export class QuestionController extends CrudBaseController({
    prefix: 'question',
    service: QuestionService,
}) {}
