import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Incompatibility extends BaseModel {
    static readonly alias: string = 'incompatibility';
    static readonly primaryKey: string = 'incompatibility_id';

    @PrimaryGeneratedColumn()
    incompatibility_id: number;

    @Column()
    fk_user_origin: number;

    @Column()
    fk_user_destination: number;
}
