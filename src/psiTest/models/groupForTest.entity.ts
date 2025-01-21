import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PsiTest } from './psiTest.entity';

@Entity({
    name: 'group_for_test',
})
export class GroupForTest extends BaseModel {
    static alias: string = 'group_for_test';
    static primaryKey: string = 'id_group_for_test';

    @PrimaryGeneratedColumn()
    id_group_for_test: number;

    @Column()
    fk_id_group: number;

    @Column()
    fk_id_test: number;

    @ManyToOne(() => PsiTest)
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;
}
