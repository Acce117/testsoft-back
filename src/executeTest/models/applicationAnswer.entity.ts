import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TestApplication } from './testApplication.entity';
import { Answer } from 'src/psiTest/models/answer.entity';
import { BaseModel } from 'src/common/models/baseModel';

@Entity({
    name: 'aplication_answer',
})
export class ApplicationAnswer extends BaseModel {
    static alias: string = 'application_answer';
    static primaryKey: string = 'id_aplication_answer';

    @PrimaryGeneratedColumn({
        name: 'id_aplication_answer',
    })
    id_application_answer: number;

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
}
