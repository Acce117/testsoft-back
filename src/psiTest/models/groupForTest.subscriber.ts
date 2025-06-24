import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { GroupForTest } from './groupForTest.entity';
import { GroupService } from 'src/tenant/services/group.service';
import { Inject } from '@nestjs/common';
import { BulkJobOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Group } from 'src/tenant/models/group.entity';
import { PsiTest } from './psiTest.entity';
import { PsiTestService } from '../services/psiTest.service';

@EventSubscriber()
export class GroupForTestSubscriber
    implements EntitySubscriberInterface<GroupForTest>
{
    @Inject(GroupService) groupService: GroupService;
    @Inject(PsiTestService) psiTestService: PsiTestService;

    constructor(
        dataSource: DataSource,
        @InjectQueue('mails') private mailsQueue: Queue,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return GroupForTest;
    }

    async afterInsert(event: InsertEvent<GroupForTest>) {
        const group: Group = await this.groupService.getOne(
            { relations: ['users'], depth: 0 },
            event.entity.fk_id_group,
        );

        const test: PsiTest = await this.psiTestService.getOne(
            {},
            event.entity.fk_id_test,
        );

        const jobs: {
            name: string;
            data: ISendMailOptions;
            options?: BulkJobOptions;
        }[] = [];

        group.users.forEach((user) => {
            jobs.push({
                name: 'do_test',
                data: {
                    to: user.email,
                    subject: 'A test has been assign to your group',
                    template: './do_test',
                    context: {
                        testName: test.name,
                        participantName: user.name,
                        duration: test.time_duration,
                        deadline: '7 days',
                        groupName: group.name_group,
                        testLink: `http:/${process.env.FRONT_DOMAIN}/execute_test/${test.id_test}`,
                        supportEmail: 'support@email.com',
                        supportPhone: 1234567,
                    },
                },
            });
        });

        try {
            this.mailsQueue.addBulk(jobs);
        } catch (error) {
            console.log(error);
        }
    }
}
