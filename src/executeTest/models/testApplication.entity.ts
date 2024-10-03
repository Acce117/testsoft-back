import { PsiTest } from 'src/psiTest/models/psiTest.entity';
import { User } from 'src/tenant/models/user.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

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

    @OneToOne(() => PsiTest)
    @JoinColumn({
        name: 'fk_id_test',
        referencedColumnName: 'id_test',
    })
    test: PsiTest;

    @Column({
        type: 'timestamp',
        name: 'date',
        nullable: false,
    })
    date: Date;
}
