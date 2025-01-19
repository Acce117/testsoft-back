import { CrudBaseService } from 'src/common/services/service';
import { TestRange } from '../models/testRange.entity';

export class TestRangeService extends CrudBaseService({
    model: TestRange,
    delete: 'hard',
}) {}
