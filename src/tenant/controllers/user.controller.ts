import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

import { Body, Get, Param, Post } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { CreateUserDto } from '../dto/create_user.dto';

export class UserController extends CrudBaseController(
    'user',
    UserService,
    CreateUserDto,
) {
    @Get('/:user_id/tests')
    public async getUserTests(@Param('user_id') user_id: number) {
        return (this.service as UserService).userTests(user_id);
    }

    @Post('/my_group')
    async createMyGroup(@Body() data, @JwtPayload() payload) {
        return await handleTransaction(
            this.dataSource,
            async () =>
                await (this.service as UserService).createMyGroup(
                    data,
                    payload.id_user,
                ),
        );
    }
}
