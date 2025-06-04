import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Exclude } from 'class-transformer';
import { Tribute } from './tribute.entity';
import { CorrectAnswer } from './correctAnswer.entity';

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

    @Column()
    @Exclude()
    fk_id_question: number;

    @ManyToOne(() => Question, (question) => question.answers, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({
        name: 'fk_id_question',
    })
    question: Question;

    @Column()
    image_url: string;

    file: Express.Multer.File;

    @OneToOne(() => Tribute, (tribute) => tribute.answer)
    tribute: Tribute;

    @OneToOne(() => CorrectAnswer, (correct_answer) => correct_answer.answer)
    correct_answer: CorrectAnswer;
}
