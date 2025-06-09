import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'Clients',
})
export class Client extends BaseModel {
    static alias: string = 'client';
    static primaryKey: string = 'user_id';

    @ViewColumn()
    user_id: number;

    @ViewColumn()
    CI: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    last_name: string;

    @ViewColumn()
    username: string;

    @ViewColumn()
    @Exclude()
    password: string;

    @ViewColumn()
    sex: string;

    @ViewColumn()
    email: string;

    @ViewColumn()
    role: string;
}
