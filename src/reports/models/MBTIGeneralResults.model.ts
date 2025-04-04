import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'resultados_general_del_test_mbti',
})
export class MBTIGeneralResults extends BaseModel {
    static alias: string = 'mbtiGeneralResults';
    static primaryKey: string;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'item_name' })
    item_name: string;
}
