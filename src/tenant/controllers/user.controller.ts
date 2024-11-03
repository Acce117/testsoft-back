import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';
import { CreateUserDto } from 'src/site/dto/register_user.dto';

export class UserController extends CrudBaseController(
    'user',
    UserService,
    CreateUserDto,
) {}
