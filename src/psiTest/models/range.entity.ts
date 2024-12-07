import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Range extends BaseModel {
    static alias: string = 'range';
    static primaryKey: string = 'id_range';

    @PrimaryGeneratedColumn()
    id_range: number;

    @Column({
        type: 'double',
    })
    min_val: number;

    @Column({
        type: 'double',
    })
    max_val: number;

    @Column({
        type: 'varchar',
    })
    indicator: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @ManyToOne(() => Item, (item) => item.ranges)
    @JoinColumn({
        name: 'fk_id_item',
        referencedColumnName: 'id_item',
    })
    item: Item;
}
