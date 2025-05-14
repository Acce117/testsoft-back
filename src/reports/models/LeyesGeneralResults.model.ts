import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'resultados_generales_leyes',
})
export class LeyesGeneralResults extends BaseModel {
    static alias: string = 'leyesGeneralResults';
    static primaryKey: string;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'item_name' })
    item_name: string;
}
