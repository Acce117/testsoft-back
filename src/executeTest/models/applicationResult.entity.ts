import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TestApplication } from './testApplication.entity';
import { Item } from 'src/psiTest/models/item.entity';

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

    @ManyToOne(() => TestApplication, (testApp) => testApp.application_result)
    @JoinColumn({
        name: 'fk_test_application',
        referencedColumnName: 'id_test_application',
    })
    test_application: TestApplication;

    @ManyToOne(() => Item)
    @JoinColumn({
        name: 'fk_item',
        referencedColumnName: 'id_item',
    })
    item: Item;
}
