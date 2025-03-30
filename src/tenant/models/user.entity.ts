import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthItem } from './auth_item.entity';
import { Country } from './country.entity';
import { Group } from './group.entity';
import { AuthAssignment } from './auth_assignment.entity';

@Entity({ name: 'user' })
export class User extends BaseModel {
    static readonly alias: string = 'user';
    static readonly primaryKey: string = 'user_id';

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 11, nullable: false, unique: true })
    CI: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    last_name: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    username: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false, length: 1 })
    sex: string;

    @Column({ default: 0, type: 'boolean' })
    deleted: boolean;

    @Column({ default: 0, type: 'boolean' })
    enabled: boolean;

    @DeleteDateColumn()
    deleted_at: Date;

    @Exclude()
    @Column()
    country_id: number;

    @OneToOne(() => Country)
    @JoinColumn({
        name: 'country_id',
        referencedColumnName: 'country_id',
    })
    country: Country;

    @ManyToMany(() => AuthItem)
    @JoinTable({
        name: 'auth_assignment',
        inverseJoinColumn: { name: 'item_id' },
        joinColumn: { name: 'user_id' },
    })
    auth_item: AuthItem[];

    @OneToMany(() => AuthAssignment, (assignment) => assignment.users, {
        cascade: true,
    })
    assignments: AuthAssignment[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'leadership',
        joinColumn: { name: 'fk_user_origin' },
        inverseJoinColumn: { name: 'fk_user_destination' },
    })
    leadership: User[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'compatibility',
        joinColumn: { name: 'fk_user_origin' },
        inverseJoinColumn: { name: 'fk_user_destination' },
    })
    compatibility: User[];

    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable({
        name: 'auth_assignment',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'user_id',
        },
        inverseJoinColumn: {
            name: 'group_id',
            referencedColumnName: 'id_group',
        },
    })
    groups: Group[];

    @ManyToMany(() => Group, (group) => group)
    @JoinTable({
        name: 'group_owner',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'user_id',
        },
        inverseJoinColumn: {
            name: 'group_id',
            referencedColumnName: 'id_group',
        },
    })
    my_groups: Group[];
}
