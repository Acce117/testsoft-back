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
import { Exclude } from 'class-transformer';

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

    @Column()
    @Exclude()
    fk_category: number;

    @ManyToOne(() => Category, { onDelete: 'CASCADE', cascade: true })
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
