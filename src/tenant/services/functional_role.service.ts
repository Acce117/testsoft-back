import { CrudBaseService } from 'src/common/services/service';
import { FunctionalRole } from '../models/functional_role.entity';

export class FunctionalRoleService extends CrudBaseService({
    model: FunctionalRole,
}) {}
