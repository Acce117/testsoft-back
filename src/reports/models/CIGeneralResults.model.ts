import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'resultados_generales_ci',
})
export class CIGeneralResults extends BaseModel {
    static alias: string = 'ciGeneralResults';
    static primaryKey: string = 'group';

    @ViewColumn({ name: 'id_test_application' })
    id_test_application: number;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'item_name' })
    item_name: string;

    @ViewColumn({ name: 'group' })
    group: number;
}
