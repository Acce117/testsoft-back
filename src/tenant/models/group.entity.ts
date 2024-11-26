// import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import { PsiTest } from 'src/psiTest/models/psiTest.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'group' })
@Tree('materialized-path')
export class Group extends BaseModel {
    static readonly alias: string = 'group';
    static readonly primaryKey: string = 'id_group';

    @PrimaryGeneratedColumn()
    id_group: number;

    @Column({
        type: 'varchar',
    })
    name_group: string;

    @Column({
        nullable: true,
    })
    father_group: number;

    @JoinColumn({
        name: 'father_group',
        referencedColumnName: 'id_group',
    })
    @TreeParent()
    parent: Group;

    @TreeChildren()
    children: Group[];

    @ManyToMany(() => PsiTest, (psiTest) => psiTest.groups)
    @JoinTable({
        name: 'group_for_test',
        joinColumn: { name: 'fk_id_group' },
        inverseJoinColumn: { name: 'fk_id_test' },
    })
    psiTests: PsiTest[];

    @OneToMany(() => User, (user) => user.group)
    users: User[];
}
