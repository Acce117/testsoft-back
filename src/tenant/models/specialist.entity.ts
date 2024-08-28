import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'specialist' })
export class Specialist extends BaseModel {
    static readonly alias: string = 'specialist';
    static readonly primaryKey: string = 'id_specialist';

    @PrimaryGeneratedColumn()
    id_specialist: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'fk_user_id' })
    user: User;

    @Column({ type: 'int' })
    years_of_experience: number;

    @Column({ type: 'varchar' })
    academic_formation: string;
}
