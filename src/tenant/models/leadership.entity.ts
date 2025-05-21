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
export class Leadership extends BaseModel {
    static readonly alias: string = 'leadership';
    static readonly primaryKey: string = 'leadership_id';

    @PrimaryGeneratedColumn()
    leadership_id: number;

    @Column()
    fk_user_origin: number;

    @Column()
    fk_user_destination: number;

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'fk_user_origin',
        referencedColumnName: 'user_id',
    })
    user_origin: User[];

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'fk_user_destination',
        referencedColumnName: 'user_id',
    })
    user_destination: User[];
}
