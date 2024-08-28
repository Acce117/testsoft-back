import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/controllers/controller';
import { GroupService } from '../services/group.service';

@Controller('groups')
export class GroupController extends BaseController(GroupService) {}
