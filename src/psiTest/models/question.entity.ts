import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TestSerie } from './testSerie.entity';
import { Answer } from './answer.entity';
import { TypeQuestion } from './typeQuestion.entity';

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

    @OneToOne(() => TypeQuestion)
    @JoinColumn({
        name: 'fk_id_type_question',
        referencedColumnName: 'id_type_question',
    })
    type: TypeQuestion;
}
