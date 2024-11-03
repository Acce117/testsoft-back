import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';

export class GroupController extends CrudBaseController(
    'groups',
    GroupService,
) {}
