import { CrudBaseController } from 'src/common/controllers/controller';
import { QuestionValueService } from '../services/questionValue.service';

export class QuestionValueController extends CrudBaseController(
    'question_value',
    QuestionValueService,
) {}
