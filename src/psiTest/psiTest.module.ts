import { Module } from '@nestjs/common';
import { PsiTestController } from './controllers/psiTest.controller';
import { PsiTestService } from './services/psiTest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsiTest } from './models/psiTest.entity';
import { TypePsiTest } from './models/typePsiTest.entity';
import { TestSerie } from './models/testSerie.entity';
import { Question } from './models/question.entity';
import { Answer } from './models/answer.entity';

@Module({
    controllers: [PsiTestController],
    providers: [PsiTestService],
    imports: [
        TypeOrmModule.forFeature([
            PsiTest,
            TypePsiTest,
            TestSerie,
            Question,
            Answer,
        ]),
    ],
})
export class PsiTestModule {}
