import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { AuthAssignment } from './auth_assignment.entity';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from './user.entity';
import { GroupService } from '../services/group.service';
import { Group } from './group.entity';
import { AuthItem } from './auth_item.entity';
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

    async afterInsert(event: InsertEvent<AuthAssignment>): Promise<any> {
        const user: User = await this.userService.getOne(
            {},
            event.entity.user_id,
        );
        const group: Group = await this.groupService.getOne(
            {},
            event.entity.group_id,
        );
        const role: AuthItem = await this.authItemService.getOne(
            {},
            event.entity.item_id,
        );

        try {
            const mailOptions: ISendMailOptions = {
                to: user.email,
                subject: 'Assigned to group with role',
                template: './notify_assignment',
                context: {
                    name: user.name,
                    group: group.name_group,
                    role: role.name,
                    supportEmail: 'support@email.com',
                    supportPhone: 1234567,
                },
            };

            this.mailsQueue.add('assignment_to_group', mailOptions);
        } catch (error) {
            console.log(error);
        }
    }
}
