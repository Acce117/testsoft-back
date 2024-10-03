import {
    BaseEntity,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TestApplication } from './testApplication.entity';
import { Answer } from 'src/psiTest/models/answer.entity';

@Entity({
    name: 'application_answer',
})
export class ApplicationAnswer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_application_answer: number;

    @OneToOne(() => TestApplication)
    @JoinColumn({
        name: 'fk_id_test_application',
        referencedColumnName: 'id_test',
    })
    testApplication: TestApplication;

    @OneToOne(() => Answer)
    @JoinColumn({
        name: 'fk_id_answer',
        referencedColumnName: 'id_answer',
    })
    answer: Answer;
}
