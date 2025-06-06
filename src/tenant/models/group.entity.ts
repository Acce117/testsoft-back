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
import { FunctionalRole } from './functional_role.entity';

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

    @TreeParent()
    @JoinColumn({
        name: 'father_group',
        referencedColumnName: 'id_group',
    })
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

    @ManyToMany(() => User, (user) => user.groups)
    @JoinTable({
        name: 'auth_assignment',
        joinColumn: {
            name: 'group_id',
            referencedColumnName: 'id_group',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'user_id',
        },
    })
    users: User[];

    @ManyToMany(() => User, (user) => user.my_groups)
    @JoinTable({
        name: 'group_owner',
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'user_id',
        },
        joinColumn: {
            name: 'group_id',
            referencedColumnName: 'id_group',
        },
    })
    owner: User[];

    @OneToMany(() => FunctionalRole, (functional_role) => functional_role.group)
    functional_roles: FunctionalRole[];

    @OneToMany(() => PsiTest, (test) => test.groupOwner)
    owned_tests: PsiTest[];
}
