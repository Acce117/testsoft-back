import { CrudBaseController } from 'src/common/controllers/controller';
import { LeadershipService } from '../services/leadership.service';

export class LeadershipController extends CrudBaseController({
    prefix: 'leadership',
    service: LeadershipService,
}) {}
