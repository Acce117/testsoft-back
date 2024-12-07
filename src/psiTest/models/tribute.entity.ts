import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tribute extends BaseModel {
    static alias: string = 'tribute';
    static primaryKey: string = 'id_tribute';

    @PrimaryColumn({
        type: 'int',
    })
    fk_id_answer: number;

    @PrimaryColumn({
        type: 'int',
    })
    fk_id_item: number;

    @Column()
    tribute_value: number;
}
