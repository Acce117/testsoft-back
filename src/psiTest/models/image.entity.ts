import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Exclude } from 'class-transformer';

@Entity({
    name: 'images',
})
export class Image extends BaseModel {
    static alias: string = 'images';
    static primaryKey: string = 'id_image';

    @PrimaryGeneratedColumn()
    id_image: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    url: string;

    @Column()
    @Exclude()
    id_question: number;

    @Column()
    @Exclude()
    id_answer: number;

    @OneToOne(() => Question, (question) => question.image)
    @JoinColumn({
        name: 'id_question',
        referencedColumnName: 'id_question',
    })
    question: Question;

    @OneToOne(() => Answer, (answer) => answer.image)
    @JoinColumn({
        name: 'id_answer',
        referencedColumnName: 'id_answer',
    })
    answer: Answer;
}
