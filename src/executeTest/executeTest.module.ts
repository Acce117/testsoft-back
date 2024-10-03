import { Module } from '@nestjs/common';
import { ExecuteTestService } from './services/executeTest.service';
import { ExecuteTestController } from './controllers/executeTest.controller';
import { PsiTestModule } from 'src/psiTest/psiTest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestApplication } from './models/testApplication.entity';
import { TestApplicationService } from './services/testApplication.service';
import { ApplicationAnswerService } from './services/applicationAnswer.service';
import { ApplicationAnswerValueService } from './services/applicationAnswerValue.service';

@Module({
    controllers: [ExecuteTestController],
    providers: [
        ExecuteTestService,
        TestApplicationService,
        ApplicationAnswerService,
        ApplicationAnswerValueService,
    ],
    imports: [PsiTestModule, TypeOrmModule.forFeature([TestApplication])],
    exports: [],
})
export class ExecuteTestModule {}
