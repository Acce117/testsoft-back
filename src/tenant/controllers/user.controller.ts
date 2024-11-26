import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';
import { CreateUserDto } from 'src/site/dto/register_user.dto';
import { Get, Param } from '@nestjs/common';

export class UserController extends CrudBaseController(
    'user',
    UserService,
    CreateUserDto,
) {
    @Get('/:user_id/tests')
    public async getUserTests(@Param('user_id') user_id: number) {
        return (this.service as UserService).userTests(user_id);
    }
}
