import { CrudBaseController } from 'src/common/controllers/controller';
import { ParameterDisplayResultService } from '../services/parameterDisplay.service';

export class ParameterDisplayResultController extends CrudBaseController({
    prefix: 'parameter_display_result',
    service: ParameterDisplayResultService,
}) {}
