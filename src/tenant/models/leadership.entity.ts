import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
