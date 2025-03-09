import { CrudBaseService } from 'src/common/services/service';
import { Incompatibility } from '../models/incompatibility.entity';

export class IncompatibilityService extends CrudBaseService({
    model: Incompatibility,
    delete: 'hard',
}) {}
