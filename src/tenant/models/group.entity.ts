import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'group' })
export class Group extends BaseModel {
    static readonly alias: string = 'group';
    static readonly primaryKey: string = 'id_group';

    @PrimaryGeneratedColumn()
    id_group: number;

    @Column({
        type: 'varchar',
    })
    name_group: string;

    @ManyToOne(() => Group, (group) => group.children, { nullable: true })
    @JoinColumn({ name: 'father_group' })
    parent: Group;

    @OneToMany(() => Group, (group) => group.parent)
    children: Group[];
}
