import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthItem } from './auth_item.entity';
import { Country } from './country.entity';
import { Group } from './group.entity';

@Entity({
    name: 'user',
})
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

    @IsEmail()
    @Column({ type: 'varchar', nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false, length: 1 })
    sex: string;

    @Column({ default: 0, type: 'tinyint' })
    deleted: number;

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

    @ManyToMany(() => User)
    @JoinTable({
        name: 'leadership',
        joinColumn: { name: 'fk_user_origin' },
        inverseJoinColumn: { name: 'fk_user_destination' },
    })
    leadership: User[];

    @ManyToMany(() => User)
    @JoinTable({
        name: 'incompatibility',
        joinColumn: { name: 'fk_user_origin' },
        inverseJoinColumn: { name: 'fk_user_destination' },
    })
    incompatibility: User[];

    @ManyToOne(() => Group, (group) => group.users)
    @JoinColumn({
        name: 'id_group',
        referencedColumnName: 'id_group',
    })
    group: Group;
}
