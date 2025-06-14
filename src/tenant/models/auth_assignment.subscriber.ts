import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { AuthAssignment } from './auth_assignment.entity';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { BadRequestException, Inject } from '@nestjs/common';

@EventSubscriber()
export class AuthAssignmentSubscriber
    implements EntitySubscriberInterface<AuthAssignment>
{
    @Inject(AuthAssignmentService) authAssignmentService: AuthAssignmentService;

    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return AuthAssignment;
    }

    async beforeInsert(event: InsertEvent<AuthAssignment>): Promise<any> {
        const element = event.entity;

        const existingAssignment = await this.authAssignmentService.getOne({
            where: {
                user_id: element.user_id,
                group_id: element.group_id,
            },
        });

        if (existingAssignment)
            throw new BadRequestException(
                'This user already has a role in this group',
            );

        return element;
    }
}
