import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
