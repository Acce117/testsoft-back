// import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

@Entity({ name: 'group' })
@Tree('materialized-path')
export class Group extends BaseModel {
    static readonly alias: string = 'group';
    static readonly primaryKey: string = 'id_group';

    @PrimaryGeneratedColumn()
    id_group: number;

    @Column({
        type: 'varchar',
    })
    name_group: string;

    @Column({
        nullable: true,
    })
    father_group: number;

    // @Column({
    //     name: 'mpath',
    //     nullable: true,
    // })
    // @Exclude()
    // mpath?: string;

    @JoinColumn({
        name: 'father_group',
        referencedColumnName: 'id_group',
    })
    @TreeParent()
    parent: Group;

    @TreeChildren()
    children: Group[];
}
