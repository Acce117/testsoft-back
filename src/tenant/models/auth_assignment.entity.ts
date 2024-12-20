import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

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

    @ManyToOne(() => Group)
    @JoinColumn({
        name: 'group_id',
        referencedColumnName: 'id_group',
    })
    groups: Group[];

    @ManyToOne(() => User, (user) => user.assignments)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'user_id',
    })
    users: User[];
}
