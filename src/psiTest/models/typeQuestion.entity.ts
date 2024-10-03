import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TypeQuestion extends BaseEntity {
    static readonly alias: string = 'type_question';
    static readonly primaryKey: string = 'id_type_question';

    @PrimaryGeneratedColumn()
    id_type_question: number;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string;
}
