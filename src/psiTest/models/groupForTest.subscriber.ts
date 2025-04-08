import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { GroupForTest } from './groupForTest.entity';
import { GroupService } from 'src/tenant/services/group.service';
import { Inject } from '@nestjs/common';
import { User } from 'src/tenant/models/user.entity';

@EventSubscriber()
export class GroupForTestSubscriber
    implements EntitySubscriberInterface<GroupForTest>
{
    @Inject(GroupService) groupService: GroupService;

    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return GroupForTest;
    }

    async afterInsert(event: InsertEvent<GroupForTest>) {
        const users: User[] = await this.groupService.getOne(
            { relations: ['users'], depth: 0 },
            event.entity.fk_id_group,
        ).users;

        users.forEach((user) => {});
    }
}
