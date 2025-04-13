import { PsiTest } from 'src/psiTest/models/psiTest.entity';
import { User } from 'src/tenant/models/user.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationResult } from './applicationResult.entity';

@Entity()
export class TestApplication extends BaseEntity {
    static readonly alias: string = 'test_application';
    static readonly primaryKey: string = 'id_test_application';

    @PrimaryGeneratedColumn()
    id_test_application: number;

    @OneToOne(() => User)
    @JoinColumn({
        name: 'fk_id_user',
        referencedColumnName: 'user_id',
    })
    user: User;

    @ManyToOne(() => PsiTest, (test) => test.test_apps)
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;

    @Column({
        type: 'int',
    })
    fk_id_test: number;

    @Column({
        type: 'int',
    })
    fk_id_user: number;

    @Column({
        type: 'bigint',
    })
    fk_id_group: number;

    @Column({
        type: 'timestamp',
        name: 'date',
        nullable: false,
    })
    date: Date;

    @OneToMany(
        () => ApplicationResult,
        (appResult) => appResult.test_application,
    )
    application_result: ApplicationResult[];
}
