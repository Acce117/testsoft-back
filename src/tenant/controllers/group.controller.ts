import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';

export class GroupController extends CrudBaseController(
    'groups',
    GroupService,
    CreateGroupDto,
    UpdateGroupDto,
) {}
