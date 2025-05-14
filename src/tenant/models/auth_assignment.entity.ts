import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';
import { AuthItem } from './auth_item.entity';

@Entity()
export class AuthAssignment extends BaseModel {
    static alias: string = 'auth_assignment';
    static primaryKey: string = 'assignment_id';

    @PrimaryGeneratedColumn()
    assignment_id: number;

    @Column()
    user_id: number;

    @Column()
    item_id: number;

    @Column()
    group_id: number;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Group)
    @JoinColumn({
        name: 'group_id',
        referencedColumnName: 'id_group',
    })
    groups: Group[];

    @OneToOne(() => AuthItem)
    @JoinColumn({
        name: 'item_id',
        referencedColumnName: 'item_id',
    })
    role: AuthItem;

    @ManyToOne(() => User, (user) => user.assignments)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'user_id',
    })
    users: User;
}
