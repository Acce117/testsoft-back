import { CrudBaseService } from 'src/common/services/service';
import { Answer } from '../models/answer.entity';

export class AnswerService extends CrudBaseService({ model: Answer }) {}
