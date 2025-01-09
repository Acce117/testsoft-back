import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';

import { Body, Delete, Get, Param, Post } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { instanceToPlain } from 'class-transformer';

export class UserController extends CrudBaseController({
    prefix: 'user',
    service: UserService,
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
}) {
    @Delete(':id')
    public async delete(@Param('id') id: number) {
        return await handleTransaction(this.dataSource, async () =>
            instanceToPlain(await (this.service as UserService).delete(id)),
        );
    }

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
