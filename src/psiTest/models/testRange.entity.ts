import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Classification } from './classification.entity';

@Entity()
export class TestRange extends BaseModel {
    static alias: string = 'test_range';
    static primaryKey: string = 'id_test_range';

    @PrimaryGeneratedColumn()
    id_test_range: number;

    @Column()
    min_val: number;

    @Column()
    max_val: number;

    @Column()
    indicator: string;

    @Column()
    description: string;

    @Column()
    @Exclude()
    fk_id_classification: number;

    @ManyToOne(
        () => Classification,
        (classification) => classification.ranges,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({
        name: 'fk_id_classification',
        referencedColumnName: 'id_classification',
    })
    classification: Classification;
}
