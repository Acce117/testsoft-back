import { Group } from '../models/group.entity';
import { TreeBaseService } from 'src/common/services/treeService';

export class GroupService extends TreeBaseService(Group) {}
