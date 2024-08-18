import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ type: 'varchar', nullable: false, length: 1, enum: ['F', 'M'] })
    sex: string;

    @Column({ default: 0, type: 'tinyint' })
    deleted: number;

    @Column({ default: 2, type: 'bigint' })
    country_id: number;
}
