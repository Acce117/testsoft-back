import { CrudBaseService } from 'src/common/services/service';
import { Tribute } from '../models/tribute.entity';

export class TributeService extends CrudBaseService({
    model: Tribute,
    delete: 'hard',
}) {}
