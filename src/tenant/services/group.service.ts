import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/services/service';
import { Group } from '../models/group.entity';

@Injectable()
export class GroupService extends AbstractService {
    protected model = Group;
}
