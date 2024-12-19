import { CrudBaseController } from 'src/common/controllers/controller';
import { UserService } from '../../tenant/services/user.service';
import { CreateUserDto } from 'src/site/dto/register_user.dto';
import { Body, Get, Param, Post } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';

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
        const queryRunner = this.dataSource.createQueryRunner();
        let result;
        try {
            await queryRunner.startTransaction();
            result = await (this.service as UserService).createMyGroup(
                data,
                payload.id_user,
            );

            await queryRunner.commitTransaction();
        } catch (e) {
            queryRunner.rollbackTransaction();
            result = e.message;
        }

        return result;
    }
}
