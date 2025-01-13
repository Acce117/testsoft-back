import { CrudBaseService } from 'src/common/services/service';
import { ApplicationAnswerValue } from '../models/applicationAnswerValue.entity';

export class ApplicationAnswerValueService extends CrudBaseService({
    model: ApplicationAnswerValue,
}) {}
