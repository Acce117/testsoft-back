import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country extends BaseModel {
    static alias: string = 'country';
    static primaryKey: string = 'country_id';

    @PrimaryGeneratedColumn()
    country_id: number;

    @Column()
    code: string;

    @Column()
    name: string;
}
