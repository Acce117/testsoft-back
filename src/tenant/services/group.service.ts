import { CrudBaseService } from 'src/common/services/service';
import { Group } from '../models/group.entity';

export class GroupService extends CrudBaseService(Group) {}
