import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Compatibility extends BaseModel {
    static readonly alias: string = 'compatibility';
    static readonly primaryKey: string = 'compatibility_id';

    @PrimaryGeneratedColumn()
    compatibility_id: number;

    @Column()
    fk_user_origin: number;

    @Column()
    fk_user_destination: number;

    @Column()
    compatible: boolean;

    @Column()
    fk_id_group: number;

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'fk_user_origin',
        referencedColumnName: 'user_id',
    })
    origin_users: User[];

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'fk_user_destination',
        referencedColumnName: 'user_id',
    })
    destination_users: User[];
}
