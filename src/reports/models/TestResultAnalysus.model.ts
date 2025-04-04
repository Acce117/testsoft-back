import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'test_result_analysis',
})
export class TestResultAnalysis extends BaseModel {
    static alias: string = 'testResultAnalysis';
    static primaryKey: string;

    @ViewColumn({ name: 'test_app' })
    test_app: number;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'user_name' })
    user_name: string;

    @ViewColumn({ name: 'item_name' })
    item_name: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'test' })
    test: string;

    @ViewColumn({ name: 'date' })
    date: string;
}
