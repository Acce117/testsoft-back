import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ApplicationResult extends BaseModel {
    static alias: string = 'application_result';
    // static primaryKey: string = '';

    @PrimaryColumn()
    fk_test_application: number;

    @PrimaryColumn()
    fk_item: number;

    @Column()
    value_result: number;
}
