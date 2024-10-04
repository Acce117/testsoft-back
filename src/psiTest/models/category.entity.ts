import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PsiTest } from './psiTest.entity';

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

    @ManyToMany(() => PsiTest, (test) => test.category)
    tests: PsiTest[];
}
