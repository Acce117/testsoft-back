import { CrudBaseService } from 'src/common/services/service';
import { Range } from '../models/range.entity';

export class RangeService extends CrudBaseService({
    model: Range,
    delete: 'hard',
}) {}
