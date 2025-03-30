import { CrudBaseService } from 'src/common/services/service';
import { Compatibility } from '../models/compatibility.entity';

export class CompatibilityService extends CrudBaseService({
    model: Compatibility,
    delete: 'hard',
}) {}
