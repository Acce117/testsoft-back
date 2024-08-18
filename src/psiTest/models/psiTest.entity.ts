import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TypePsiTest } from './typePsiTest.entity';
import { TestSerie } from './testSerie.entity';

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

    @OneToOne(() => TypePsiTest)
    @JoinColumn({
        name: 'fk_id_type_test',
    })
    type_psi_test: TypePsiTest;

    @OneToMany(() => TestSerie, (serie) => serie.test)
    series: TestSerie[];
}
