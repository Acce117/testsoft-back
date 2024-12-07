import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TestApplication } from './testApplication.entity';

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
}
