import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'auth_item',
})
export class AuthItem extends BaseModel {
    static readonly alias: string = 'auth_item';
    static readonly primaryKey: string = 'item_id';

    @PrimaryGeneratedColumn()
    item_id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'int', nullable: false })
    type: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', nullable: true })
    rule_name: string;

    @Column({ type: 'text', nullable: true })
    data: string;
}
