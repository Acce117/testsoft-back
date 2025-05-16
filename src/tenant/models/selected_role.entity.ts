import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SelectedRole extends BaseModel {
    static alias: string = 'selected_role';
    static primaryKey: string = 'id_selected_rol';

    @PrimaryGeneratedColumn()
    id_selected_rol: number;

    @Column()
    fk_id_user: number;

    @Column()
    fk_id_rol: number;

    @Column()
    preferred: boolean;
}
