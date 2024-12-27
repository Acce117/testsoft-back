import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PsiTest } from './psiTest.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ParameterDisplayResult extends BaseModel {
    static alias: string = 'parameter_display_result';
    static primaryKey: string = 'id_parameter_display';

    @PrimaryGeneratedColumn()
    id_parameter_display: number;

    @Column()
    @Exclude()
    fk_id_test: number;

    @Column()
    global_result: boolean;

    @Column()
    all_element_value: boolean;

    @Column()
    element_by_category: boolean;

    @Column()
    tops_values: boolean;

    @Column()
    count_min: number;

    @Column()
    count_max: number;

    @OneToOne(() => PsiTest, (test) => test.display_parameters)
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;
}
