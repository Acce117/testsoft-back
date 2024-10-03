import { Controller, Inject } from '@nestjs/common';
import { BaseController } from 'src/common/controllers/controller';
import { AbstractService } from 'src/common/services/service';
import { GroupService } from '../services/group.service';

@Controller('groups')
export class GroupController extends BaseController {
    @Inject(GroupService) service: AbstractService;
}
