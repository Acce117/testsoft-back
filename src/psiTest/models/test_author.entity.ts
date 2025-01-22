import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'test_author',
})
export class TestAuthor extends BaseModel {
    static alias: string;
    static primaryKey: string;

    @PrimaryGeneratedColumn()
    test_author_id: number;

    @Column()
    test_id: number;

    @Column()
    user_id: number;
}
