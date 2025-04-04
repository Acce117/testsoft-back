import { BaseModel } from 'src/common/models/baseModel';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'resultados_generales_de_belbin',
})
export class BelbinGeneralResults extends BaseModel {
    static alias: string = 'belbineneralResults';
    static primaryKey: string;

    @ViewColumn({ name: 'CI' })
    ci: string;

    @ViewColumn({ name: 'value_result' })
    value_result: number;

    @ViewColumn({ name: 'item_name' })
    item_name: string;
}
