import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupForTestService } from '../services/groupForTest.service';

export class GroupForTestController extends CrudBaseController({
    prefix: 'group_for_test',
    service: GroupForTestService,
}) {}
