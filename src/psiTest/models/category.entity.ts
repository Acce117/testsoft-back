import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PsiTest } from './psiTest.entity';
import { Item } from './item.entity';

@Entity()
export class Category extends BaseModel {
    static readonly alias: string = 'category';
    static readonly primaryKey: string = 'id_category';

    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    description: string;

    @ManyToMany(() => PsiTest, (test) => test.category, { onDelete: 'CASCADE' })
    tests: PsiTest[];

    @OneToMany(() => Item, (item) => item.category)
    items: Item[];
}
