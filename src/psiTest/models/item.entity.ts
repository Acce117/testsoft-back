import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Range } from './range.entity';

@Entity()
export class Item extends BaseModel {
    static alias: string = 'item';
    static primaryKey: string = 'id_item';

    @PrimaryGeneratedColumn()
    id_item: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    description: string;

    @ManyToOne(() => Category)
    @JoinColumn({
        name: 'fk_category',
        referencedColumnName: 'id_category',
    })
    category: Category;

    @OneToMany(() => Range, (range) => range.item)
    ranges: Range[];

    @Column({ type: 'int' })
    priority: number;
}
