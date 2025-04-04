import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'resultados_generales_de_te',
})
export class TEGeneralResults extends BaseModel {
    static alias: string = 'teGeneralResults';
    static primaryKey: string;

    @ViewColumn({ name: 'test_app' })
    test_app: number;

    @ViewColumn({ name: 'name' })
    name: string;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'item_name' })
    item_name: string;

    @ViewColumn({ name: 'calificacion' })
    rating: string;
}
