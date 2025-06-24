import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { BadRequestException } from '@nestjs/common';

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

    private hashPassword(password) {
        password = bcrypt.hashSync(password, parseInt(process.env.HASH_SALT));

        return password;
    }

    private async verifyUniqueEmail(email) {
        const user = await User.getRepository().findOneBy({ email });

        return user === null;
    }

    async beforeInsert(event: InsertEvent<User>): Promise<any> {
        const result = await this.verifyUniqueEmail(event.entity.email);

        if (!result) throw new BadRequestException('this email already exist');

        if (event.entity.created_scenario === 'created')
            event.entity.password = process.env.DEFAULT_PASSWORD;

        event.entity.password = this.hashPassword(event.entity.password);
    }

    beforeUpdate(event: UpdateEvent<User>): Promise<any> | void {
        const result = event.updatedColumns.find(
            (column) => column.propertyName === 'password',
        );
        if (result)
            event.entity.password = this.hashPassword(event.entity.password);
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

    afterUpdate(event: UpdateEvent<User>): Promise<any> | void {
        const user = event.entity;

        const mailOptions: ISendMailOptions = {
            to: event.entity.email,
            subject: 'Account created successfully',
            template: './notify_account_state',
        };

        const result = event.updatedColumns.find(
            (column) => column.propertyName === 'enabled',
        );
        if (result) {
            if (user.enabled) {
                mailOptions.context = {
                    name: event.entity.name,
                    supportEmail: 'support@email.com',
                    supportPhone: 1234567,
                    message:
                        'Your account has been enabled, since now you can enjoy our service.',
                };
            } else {
                mailOptions.context = {
                    name: event.entity.name,
                    supportEmail: 'support@email.com',
                    supportPhone: 1234567,
                    message:
                        'We sorry to announce that your account has been banned, if you have any question please contact our support team',
                };
            }

            this.mailsQueue.add('account_state_changed', mailOptions);
        }
    }
}
