import { CrudBaseService } from 'src/common/services/service';
import { QuestionTopValue } from '../models/questionValue.entity';

export class QuestionValueService extends CrudBaseService({
    model: QuestionTopValue,
}) {}
