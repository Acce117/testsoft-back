import { CrudBaseController } from 'src/common/controllers/controller';
import { CompatibilityService } from '../services/compatibility.service';

export class CompatibilityController extends CrudBaseController({
    prefix: 'compatibility',
    service: CompatibilityService,
}) {}
