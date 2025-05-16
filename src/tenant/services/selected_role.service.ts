import { CrudBaseService } from 'src/common/services/service';
import { SelectedRole } from '../models/selected_role.entity';

export class SelectedRoleService extends CrudBaseService({
    model: SelectedRole,
}) {}
