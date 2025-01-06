import { CrudBaseController } from 'src/common/controllers/controller';
import { TypeQuestionService } from '../services/typeQuestion.service';

export class TypeQuestionController extends CrudBaseController({
    prefix: 'type_question',
    service: TypeQuestionService,
}) {}
