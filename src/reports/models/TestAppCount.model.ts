import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'test_app_count',
})
export class TestAppCount extends BaseModel {
    static alias: string = 'testAppCount';
    static primaryKey: string;

    @ViewColumn({ name: 'name' })
    name: string;

    @ViewColumn({ name: 'count' })
    count: number;
}
