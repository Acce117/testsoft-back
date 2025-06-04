import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { Body, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MyGroupInterceptor } from '../interceptors/myGroup.interceptor';
import { instanceToPlain } from 'class-transformer';

export class GroupController extends CrudBaseController({
    prefix: 'groups',
    service: GroupService,
    createDto: CreateGroupDto,
    updateDto: UpdateGroupDto,
    getAll: {
        decorators: [UseInterceptors(MyGroupInterceptor)],
    },
}) {
    @Get('parents/:id')
    getAncestors(@Param('id') id, @Query() query: any, @Body() body: any) {
        return (this.service as GroupService).getAncestors(
            { ...query, ...body },
            id,
        );
    }

    @Get('users_from_group/:id')
    public async getUsersFromGroup(
        @Param('id') id,
        @Query() query,
        @Body() body,
    ) {
        const data = await (this.service as GroupService).getUsersFromGroup(
            { ...query, ...body },
            id,
        );

        return instanceToPlain(data);
    }

    @Get('users_with_compatibility/:id')
    public async getUsersWithLeadershipAndIncompatibilities(
        @Param('id') id,
        @Query() query,
        @Body() body,
    ) {
        const data = await (
            this.service as GroupService
        ).getUsersWithLeadershipAndIncompatibilities({ ...query, ...body }, id);

        return instanceToPlain(data);
    }

    @Get('users')
    public async getUsers(
        // @Param('id') id,
        @Query() query: any,
        @Body() body: any,
    ) {
        const data = await (this.service as GroupService).getUsersFromTree({
            ...query,
            ...body,
        });

        return instanceToPlain(data);
    }
}
