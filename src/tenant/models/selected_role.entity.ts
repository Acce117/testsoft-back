import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { FunctionalRole } from './functional_role.entity';

@Entity({
    name: 'selected_rol',
})
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

    @Column()
    fk_id_group: number;

    @ManyToOne(() => FunctionalRole)
    @JoinColumn({
        referencedColumnName: 'id_rol',
        name: 'fk_id_rol',
    })
    role: FunctionalRole;
}
