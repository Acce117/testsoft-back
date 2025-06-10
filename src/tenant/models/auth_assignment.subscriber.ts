import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
} from 'typeorm';
import { AuthAssignment } from './auth_assignment.entity';
import { Inject } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';
import { AuthItemService } from '../services/authItem.service';

@EventSubscriber()
export class AuthAssignmentSubscriber implements EntitySubscriberInterface {
    @Inject(UserService) userService: UserService;
    @Inject(GroupService) groupService: GroupService;
    @Inject(AuthItemService) authItemService: AuthItemService;

    constructor(
        dataSource: DataSource,
        @InjectQueue('mails') private mailsQueue: Queue,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return AuthAssignment;
    }
}
