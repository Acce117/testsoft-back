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
import { TestSerieController } from './controllers/testSerie.controller';
import { TestSerieService } from './services/testSerie.service';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { ItemService } from './services/item.service';
import { ItemController } from './controllers/item.controller';
import { QuestionValueService } from './services/questionValue.service';
import { QuestionValueController } from './controllers/questionValue.controller';
import { TypeQuestionService } from './services/typeQuestion.service';
import { TypeQuestionController } from './controllers/typeQuestion.controller';
import { ParameterDisplayResultController } from './controllers/parameterDisplay.controller';
import { ParameterDisplayResultService } from './services/parameterDisplay.service';
import { TestRange } from './models/testRange.entity';
import { Classification } from './models/classification.entity';
import { EquationController } from './controllers/equation.controller';

@Module({
    controllers: [
        PsiTestController,
        TributeController,
        TypePsiTestController,
        TestSerieController,
        QuestionController,
        CategoryController,
        ItemController,
        QuestionValueController,
        TypeQuestionController,
        ParameterDisplayResultController,
        EquationController,
    ],
    providers: [
        PsiTestService,
        SeriesService,
        TributeService,
        EquationService,
        TypePsiTestService,
        TestSerieService,
        QuestionService,
        CategoryService,
        ItemService,
        QuestionValueService,
        TypeQuestionService,
        ParameterDisplayResultService,
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
            TestRange,
            Classification,
        ]),
    ],
    exports: [PsiTestService, TributeService, EquationService],
})
export class PsiTestModule {}
