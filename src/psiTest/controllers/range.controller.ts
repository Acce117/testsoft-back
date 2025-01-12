import { CrudBaseController } from 'src/common/controllers/controller';
import { RangeService } from '../services/range.service';

export class RangeController extends CrudBaseController({
    prefix: 'range',
    service: RangeService,
}) {}
