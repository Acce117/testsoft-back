import { CrudBaseController } from 'src/common/controllers/controller';
import { TestRangeService } from '../services/testRange.service';

export class TestRangeController extends CrudBaseController({
    prefix: 'test_range',
    service: TestRangeService,
}) {}
