import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

export class UserController extends CrudBaseController(
    'user',
    UserService,
    {},
) {}
