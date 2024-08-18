import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer extends BaseModel {
    static readonly alias: string = 'answer';
    static readonly primaryKey: string = 'id_answer';

    @PrimaryGeneratedColumn()
    id_answer: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    text: string;

    @ManyToOne(() => Question, (question) => question.answers)
    @JoinColumn({
        name: 'fk_id_question',
    })
    question: Question;
}
