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
import { QuestionTopValue } from './questionValue.entity';
import { Exclude, Transform } from 'class-transformer';

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

    @ManyToOne(() => TestSerie, (serie) => serie.questions, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({
        name: 'fk_id_serie',
    })
    serie: TestSerie;

    @OneToMany(() => Answer, (answer) => answer.question)
    @Transform(({ value, obj }) => {
        let result = value;
        if (obj.answers) {
            if (
                obj.fk_id_type_question === 3 ||
                obj.fk_id_type_question === 6
            ) {
                result = value.map((answer) => ({
                    ...answer,
                    text: undefined,
                }));
            }
        }
        return result;
    })
    answers: Answer[];

    @OneToOne(() => TypeQuestion)
    @JoinColumn({
        name: 'fk_id_type_question',
        referencedColumnName: 'id_type_question',
    })
    type: TypeQuestion;

    @Column()
    image_url: string;

    @OneToOne(() => QuestionTopValue, (top_value) => top_value.question)
    top_value: QuestionTopValue;

    file: Express.Multer.File;
}
