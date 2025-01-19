import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/models/baseModel';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PsiTest } from './psiTest.entity';
import { TestRange } from './testRange.entity';

@Entity()
export class Classification extends BaseModel {
    static alias: string = 'classification';
    static primaryKey: string = 'id_classification';

    @PrimaryGeneratedColumn()
    id_classification: number;

    @Column()
    name_classification: string;

    @Column()
    @Exclude()
    fk_id_test: number;

    @ManyToOne(() => PsiTest, (test) => test.classifications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;

    @OneToMany(() => TestRange, (testRange) => testRange.classification)
    ranges: TestRange[];
}
