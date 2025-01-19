import { CrudBaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create_group.dto';
import { UpdateGroupDto } from '../dto/update_group.dto';
import { Body, Get, Param, Query } from '@nestjs/common';

export class GroupController extends CrudBaseController({
    prefix: 'groups',
    service: GroupService,
    createDto: CreateGroupDto,
    updateDto: UpdateGroupDto,
}) {
    @Get('parents/:id')
    async getAncestors(
        @Param('id') id,
        @Query() query: any,
        @Body() body: any,
    ) {
        return await (this.service as GroupService).getAncestors(
            { ...query, ...body },
            id,
        );
    }
}
