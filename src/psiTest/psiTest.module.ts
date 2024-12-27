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
import { Image } from './models/image.entity';
import { Item } from './models/item.entity';
import { TributeService } from './services/tribute.service';
import { Tribute } from './models/tribute.entity';
import { EquationService } from './services/equation.service';
import { ParameterDisplayResult } from './models/parameterResult.entity';
import { Range } from './models/range.entity';
import { TributeController } from './controllers/tribute.controller';
import { QuestionTopValue } from './models/questionValue.entity';
import { TypePsiTestController } from './controllers/typePsiTest.controller';
import { TypePsiTestService } from './services/typePsiTest.service';

@Module({
    controllers: [PsiTestController, TributeController, TypePsiTestController],
    providers: [
        PsiTestService,
        SeriesService,
        TributeService,
        EquationService,
        TypePsiTestService,
    ],
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
            Image,
            Item,
            Tribute,
            ParameterDisplayResult,
            Range,
            QuestionTopValue,
        ]),
    ],
    exports: [PsiTestService, TributeService, EquationService],
})
export class PsiTestModule {}
