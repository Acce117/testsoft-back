import { CrudBaseService } from 'src/common/services/service';
import { GroupForTest } from '../models/groupForTest.entity';

export class GroupForTestService extends CrudBaseService({
    model: GroupForTest,
    delete: 'hard',
}) {}
