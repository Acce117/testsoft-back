import { CrudBaseController } from 'src/common/controllers/controller';
import { IncompatibilityService } from '../services/incompatibility.service';

export class IncompatibilityController extends CrudBaseController({
    prefix: 'incompatibility',
    service: IncompatibilityService,
}) {}
