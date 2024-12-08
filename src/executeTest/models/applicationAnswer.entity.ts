import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TestApplication } from './testApplication.entity';
import { Answer } from 'src/psiTest/models/answer.entity';

@Entity({
    name: 'aplication_answer',
})
export class ApplicationAnswer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_aplication_answer: number;

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
