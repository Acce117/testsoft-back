import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TestSerie } from './testSerie.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question extends BaseModel {
    static readonly alias: string = 'question';
    static readonly primaryKey: string = 'id_question';

    @PrimaryGeneratedColumn()
    id_question: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    statement: string;

    @ManyToOne(() => TestSerie, (serie) => serie.questions)
    @JoinColumn({
        name: 'fk_id_serie',
    })
    serie: TestSerie;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];
}
