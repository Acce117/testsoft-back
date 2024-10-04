import { Module } from '@nestjs/common';
import { PsiTestController } from './controllers/psiTest.controller';
import { PsiTestService } from './services/psiTest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsiTest } from './models/psiTest.entity';
import { TypePsiTest } from './models/typePsiTest.entity';
import { TestSerie } from './models/testSerie.entity';
import { Question } from './models/question.entity';
import { Answer } from './models/answer.entity';
import { SeriesService } from './services/seriesService.service';
import { TypeQuestion } from './models/typeQuestion.entity';
import { Category } from './models/category.entity';
import { CorrectAnswer } from './models/correctAnswer.entity';
import { Equation } from './models/equation.entity';

@Module({
    controllers: [PsiTestController],
    providers: [PsiTestService, SeriesService],
    imports: [
        TypeOrmModule.forFeature([
            PsiTest,
            TypePsiTest,
            TestSerie,
            Question,
            Answer,
            TypeQuestion,
            Category,
            CorrectAnswer,
            Equation,
        ]),
    ],
    exports: [PsiTestService],
})
export class PsiTestModule {}
