import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from 'src/common/models/baseModel';
import { Answer } from 'src/psiTest/models/answer.entity';
import { TestApplication } from './testApplication.entity';

@Entity({
    name: 'aplication_answer_value',
})
export class ApplicationAnswerValue extends BaseModel {
    static alias: string = 'application_answer_value';
    static primaryKey: string = 'id_aplication_answer_value';

    @PrimaryGeneratedColumn({ name: 'id_aplication_answer_value' })
    id_application_answer_value: number;

    @OneToOne(() => TestApplication)
    @JoinColumn({
        name: 'fk_id_test_aplication',
        referencedColumnName: 'id_test_application',
    })
    testApplication: TestApplication;

    @Column({
        type: 'int',
    })
    fk_id_test_aplication: number;

    @Column({
        type: 'int',
    })
    fk_id_answer: number;

    @OneToOne(() => Answer)
    @JoinColumn({
        name: 'fk_id_answer',
        referencedColumnName: 'id_answer',
    })
    answer: Answer;

    @Column({
        type: 'int',
    })
    value: number;
}
