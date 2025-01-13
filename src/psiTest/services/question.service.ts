import { CrudBaseService } from 'src/common/services/service';
import { Question } from '../models/question.entity';

export class QuestionService extends CrudBaseService({ model: Question }) {}
