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
import { Image } from './image.entity';
import { Exclude } from 'class-transformer';

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

    @ManyToOne(() => Question, (question) => question.answers)
    @JoinColumn({
        name: 'fk_id_question',
    })
    question: Question;

    @OneToOne(() => Image, (image) => image.question)
    image: Image;
}
