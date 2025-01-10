import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Tribute extends BaseModel {
    static alias: string = 'tribute';
    static primaryKey: string = 'id_tribute';

    @PrimaryColumn({
        type: 'int',
    })
    fk_id_answer: number;

    @PrimaryColumn({
        type: 'int',
    })
    fk_id_item: number;

    @Column()
    tribute_value: number;

    @OneToOne(() => Answer, (answer) => answer.tribute)
    @JoinColumn({
        name: 'fk_id_answer',
        referencedColumnName: 'id_answer',
    })
    answer: Answer;
}
