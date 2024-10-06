import { ApplicationAnswer } from '../models/applicationAnswer.entity';
import { CrudBaseService } from 'src/common/services/service';

export class ApplicationAnswerService extends CrudBaseService(
    ApplicationAnswer,
) {}
