import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from './group.entity';

@Entity({ name: 'functional_role' })
export class FunctionalRole extends BaseModel {
    static alias: string = 'functional_role';
    static readonly primaryKey: string = 'id_rol';

    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column()
    rol_name: string;

    @Column()
    rol_descrip: string;

    @Column()
    id_group: number;

    @ManyToOne(() => Group, (group) => group.functional_roles)
    @JoinColumn({
        name: 'id_group',
        referencedColumnName: 'id_group',
    })
    group: Group;
}
