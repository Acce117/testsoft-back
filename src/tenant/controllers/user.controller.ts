import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

@Controller('/user')
export class UserController extends BaseController(UserService) {}
