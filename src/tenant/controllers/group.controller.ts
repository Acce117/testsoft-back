import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { Body, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MyGroupInterceptor } from '../interceptors/myGroup.interceptor';

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

    @Get('users/:id')
    getUsers(@Param('id') id, @Query() query: any, @Body() body: any) {
        return (this.service as GroupService).getUsers(
            { ...query, ...body },
            id,
        );
    }
}
