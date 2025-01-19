import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

import { Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { RoleGuard, Roles } from 'src/common/guards/RoleGuard.guard';

export class UserController extends CrudBaseController({
    prefix: 'user',
    service: UserService,
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,

    decorators: [
        UseGuards(RoleGuard),
        Roles(['Admin', 'Super Admin', 'Client']),
    ],
}) {
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
