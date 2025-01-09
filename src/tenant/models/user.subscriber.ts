import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    SoftRemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
    constructor(dataSource: DataSource) {
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

    beforeSoftRemove(event: SoftRemoveEvent<any>): Promise<any> | void {
        console.log('hola');
    }
}
