import { BaseModel } from 'src/common/models/baseModel';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PsiTest } from './psiTest.entity';

@Entity()
export class Equation extends BaseModel {
    static readonly alias: string = 'equation';
    static readonly primaryKey: string = 'fk_id_test';

    @PrimaryColumn()
    fk_id_test: number;

    @OneToOne(() => PsiTest, (test) => test.equation, {
        onDelete: 'CASCADE',
        cascade: true,
    })
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    equation: string;
}
