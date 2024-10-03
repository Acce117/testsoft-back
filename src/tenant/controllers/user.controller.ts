import { Controller, Inject } from '@nestjs/common';
import { BaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';
import { AbstractService } from 'src/common/services/service';

@Controller('/user')
export class UserController extends BaseController {
    @Inject(UserService) service: AbstractService;
}
