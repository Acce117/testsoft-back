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
import { Image } from './image.entity';
import { QuestionTopValue } from './questionValue.entity';
import { Exclude } from 'class-transformer';

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

    @Column()
    @Exclude()
    fk_id_type_question: number;

    @Column()
    @Exclude()
    fk_id_serie: number;

    @Column()
    @Exclude()
    image: number;

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

    @OneToOne(() => Image, (image) => image.question)
    picture: Image;

    @OneToOne(() => QuestionTopValue, (top_value) => top_value.question)
    top_value: QuestionTopValue;
}
