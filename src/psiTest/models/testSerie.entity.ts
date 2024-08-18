import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PsiTest } from './psiTest.entity';
import { Question } from './question.entity';

@Entity({
    name: 'serie',
})
export class TestSerie extends BaseModel {
    static readonly alias: string = 'serie';
    static readonly primaryKey: string = 'id_serie';

    @PrimaryGeneratedColumn()
    id_serie: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    description: string;

    @Column({
        type: 'int',
        nullable: false,
    })
    time_serie_duration: number;

    @ManyToOne(() => PsiTest, (test) => test.series)
    @JoinColumn({
        name: 'fk_id_test',
    })
    test: PsiTest;

    @OneToMany(() => Question, (question) => question.serie)
    questions: Question[];
}
