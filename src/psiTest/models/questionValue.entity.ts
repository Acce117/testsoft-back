import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class QuestionTopValue extends BaseModel {
    static alias: string = 'question_top_value';
    static primaryKey: string = 'id_top_value';

    @PrimaryGeneratedColumn()
    id_top_value: number;

    @Column()
    top_value: number;

    @Column()
    @Exclude()
    fk_id_question: number;

    @OneToOne(() => Question, (question) => question.top_value, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'fk_id_question',
        referencedColumnName: 'id_question',
    })
    question: Question;
}
