import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    constructor(
        dataSource: DataSource,
        @InjectQueue('mails') private mailsQueue: Queue,
    ) {
        dataSource.subscribers.push(this);
    }
    listenTo() {
        return User;
    }

    private hashPassword(data) {
        if (!data.password) throw new BadRequestException();

        data.password = bcrypt.hashSync(
            data.password,
            parseInt(process.env.HASH_SALT),
        );

        return data;
    }

    beforeInsert(event: InsertEvent<any>): Promise<any> | void {
        event.entity = this.hashPassword(event.entity);
    }

    beforeUpdate(event: UpdateEvent<any>): Promise<any> | void {
        if (event.entity.password)
            event.entity = this.hashPassword(event.entity);
    }

    afterInsert(event: InsertEvent<User>): Promise<any> | void {
        try {
            if (event.entity.created_scenario === 'created') {
                const mailOptions: ISendMailOptions = {
                    to: event.entity.email,
                    subject: 'Account created successfully',
                    template: './notify_register',
                    context: {
                        name: event.entity.name,
                        passwordLink: '#',
                        supportEmail: 'support@email.com',
                        supportPhone: 1234567,
                    },
                };

                this.mailsQueue.add('created_account_successful', mailOptions);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
