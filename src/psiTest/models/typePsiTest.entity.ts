import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'type_test',
})
export class TypePsiTest extends BaseModel {
    static readonly alias: string = 'type_test';
    static readonly primaryKey: string = 'id_type_test';

    @PrimaryGeneratedColumn()
    id_type_test: number;

    @Column()
    type_test_name: string;

    @Column()
    description: string;
}
