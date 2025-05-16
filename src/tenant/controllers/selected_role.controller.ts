import { CrudBaseController } from 'src/common/controllers/controller';
import { SelectedRoleService } from '../services/selected_role.service';

export class SelectedRoleController extends CrudBaseController({
    prefix: 'selected_role',
    service: SelectedRoleService,
}) {}
