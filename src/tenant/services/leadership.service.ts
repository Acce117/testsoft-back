import { CrudBaseService } from 'src/common/services/service';
import { Leadership } from '../models/leadership.entity';

export class LeadershipService extends CrudBaseService({
    model: Leadership,
    delete: 'hard',
}) {}
