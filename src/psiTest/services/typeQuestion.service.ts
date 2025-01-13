import { CrudBaseService } from 'src/common/services/service';
import { TypeQuestion } from '../models/typeQuestion.entity';

export class TypeQuestionService extends CrudBaseService({
    model: TypeQuestion,
}) {}
