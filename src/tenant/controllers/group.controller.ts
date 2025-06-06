import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';
import { GroupDto } from '../dto/group.dto';
import {
    Body,
    Get,
    Param,
    ParseArrayPipe,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { MyGroupInterceptor } from '../interceptors/myGroup.interceptor';
import { instanceToPlain } from 'class-transformer';

export class GroupController extends CrudBaseController({
    prefix: 'groups',
    service: GroupService,
    dto: GroupDto,
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
        @Query('groups', ParseArrayPipe) query,
        @Query('where') where,
        @Query() { limit = null, offset = null },
    ) {
        const data = await (this.service as GroupService).getUsersFromTree({
            groups: query,
            where,
            limit,
            offset,
        });

        return instanceToPlain(data);
    }
}
