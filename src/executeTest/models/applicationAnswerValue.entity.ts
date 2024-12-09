import { Column, Entity } from 'typeorm';
import { ApplicationAnswer } from './applicationAnswer.entity';

@Entity({
    name: 'aplication_answer_value',
})
export class ApplicationAnswerValue extends ApplicationAnswer {
    @Column({
        type: 'int',
    })
    value: number;
}
