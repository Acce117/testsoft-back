import { BaseModel } from 'src/common/models/baseModel';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'student' })
export class Student extends BaseModel {
    static readonly alias: string = 'student';
    static readonly primaryKey: string = 'id_student';

    @PrimaryGeneratedColumn()
    id_student: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'fk_user_id' })
    user: User;
}
