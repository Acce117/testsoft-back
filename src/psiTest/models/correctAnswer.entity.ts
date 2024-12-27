import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { Exclude } from 'class-transformer';

@Entity({
    name: 'correct_answer',
})
export class CorrectAnswer extends BaseModel {
    static readonly alias: string = 'correct_answer';
    static readonly primaryKey: string = 'id_correct_answer';

    @PrimaryGeneratedColumn()
    id_correct_answer: number;

    @Column()
    @Exclude()
    fk_id_answer: number;

    @OneToOne(() => Answer, {})
    @JoinColumn({
        name: 'fk_id_answer',
        referencedColumnName: 'id_answer',
    })
    answer: Answer;
}
