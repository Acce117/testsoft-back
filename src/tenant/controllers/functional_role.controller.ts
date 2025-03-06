import { CrudBaseController } from 'src/common/controllers/controller';
import { FunctionalRoleService } from '../services/functional_role.service';

export class FunctionalRoleController extends CrudBaseController({
    prefix: 'functional_role',
    service: FunctionalRoleService,
}) {}
