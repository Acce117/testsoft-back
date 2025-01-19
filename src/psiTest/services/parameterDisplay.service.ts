import { CrudBaseService } from 'src/common/services/service';
import { ParameterDisplayResult } from '../models/parameterResult.entity';

export class ParameterDisplayResultService extends CrudBaseService({
    model: ParameterDisplayResult,
    delete: 'hard',
}) {}
