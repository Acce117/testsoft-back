import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TypePsiTest } from './typePsiTest.entity';
import { TestSerie } from './testSerie.entity';
import { Equation } from './equation.entity';
import { Category } from './category.entity';
import { User } from 'src/tenant/models/user.entity';
import { Group } from 'src/tenant/models/group.entity';
import { ParameterDisplayResult } from './parameterResult.entity';
import { Exclude } from 'class-transformer';
import { Classification } from './classification.entity';

@Entity({
    name: 'test',
})
export class PsiTest extends BaseModel {
    static readonly alias: string = 'test';
    static readonly primaryKey: string = 'id_test';

    @PrimaryGeneratedColumn()
    id_test: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'int', nullable: false })
    recurring_time: number;

    @Column({ type: 'int', nullable: false })
    time_duration: number;

    @Column({ type: 'tinyint', nullable: false, default: 1 })
    navigable: boolean;

    @Column({ type: 'tinyint', nullable: false, default: 1 })
    completed: boolean;

    @Column({ type: 'tinyint', nullable: false, default: 0 })
    done: boolean;

    @Column({ type: 'varchar', nullable: false, length: 3 })
    language: string;

    @Exclude()
    @Column({ type: 'int', nullable: false })
    fk_id_type_test: number;

    @OneToOne(() => TypePsiTest)
    @JoinColumn({
        name: 'fk_id_type_test',
    })
    type_psi_test: TypePsiTest;

    @OneToMany(() => TestSerie, (serie) => serie.test)
    series: TestSerie[];

    @OneToOne(() => Equation, (equation) => equation.test)
    equation: Equation;

    @ManyToMany(() => Category, (category) => category.tests)
    @JoinTable({
        name: 'test_category',
        joinColumn: {
            name: 'fk_id_test',
            referencedColumnName: 'id_test',
        },
        inverseJoinColumn: {
            name: 'fk_id_category',
            referencedColumnName: 'id_category',
        },
    })
    category: Category[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'test_author',
        joinColumn: { name: 'test_id' },
        inverseJoinColumn: { name: 'user_id' },
    })
    authors: User[];

    @ManyToMany(() => Group, (group) => group.psiTests)
    @JoinTable({
        name: 'group_for_test',
        joinColumn: { name: 'fk_id_test' },
        inverseJoinColumn: { name: 'fk_id_group' },
    })
    groups: Group[];

    @OneToOne(() => ParameterDisplayResult, (params) => params.test)
    display_parameters: ParameterDisplayResult;

    @ManyToOne(() => Classification, (classification) => classification.test)
    classifications: Classification[];
}
