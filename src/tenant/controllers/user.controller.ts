import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

import { Body, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class UserController extends CrudBaseController({
    prefix: 'user',
    service: UserService,
    createDto: CreateUserDto,
    // updateDto: UpdateUserDto,

    decorators: [
        UseGuards(RoleGuard),
        Roles(['Admin', 'Super Admin', 'Client']),
    ],

    getOne: {
        decorators: [UseGuards(RoleGuard), Roles(['Executor'])],
    },
}) {
    @Get('tests')
    @UseGuards(RoleGuard)
    @Roles(['Executor'])
    public getUserTests(@JwtPayload() payload, @Query() params) {
        return (this.service as UserService).userTests(
            payload.user_id,
            payload.group,
            params,
        );
    }

    @Get('selected_roles/:user_id/:group_id')
    @UseGuards(RoleGuard)
    @Roles(['Executor', 'Analyst'])
    public getSelectedRoles(@Param() { user_id, group_id }) {
        return (this.service as UserService).selectedRoles(user_id, group_id);
    }

    @Post('/my_group')
    @UseGuards(RoleGuard)
    @Roles(['Client'])
    createMyGroup(@Body() data, @JwtPayload() payload) {
        return handleTransaction(
            this.dataSource,
            async () =>
                await (this.service as UserService).createMyGroup(
                    data,
                    payload.id_user,
                ),
        );
    }

    @Post('/invite_to_group')
    inviteToGroup(
        @Body() data: { group_id: string; user_id: string; item_id: string },
    ): Promise<any> {
        return (this.service as UserService).inviteToGroup(data);
    }
}
