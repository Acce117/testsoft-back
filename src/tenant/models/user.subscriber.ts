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
        if (event.entity.password)
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
}
