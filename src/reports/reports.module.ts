import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './providers/reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BelbinGeneralResults } from './models/BelbinGeneralResults.model';
import { MBTIGeneralResults } from './models/MBTIGeneralResults.model';
import { TEGeneralResults } from './models/TEGeneralResults.model';
import { TestAppCount } from './models/TestAppCount.model';
import { TestResultAnalysis } from './models/TestResultAnalysus.model';
import { PreferredAvoidedRoles } from './models/PreferredAvoidedRoles.model';
import { CIGeneralResults } from './models/CIGeneralResults.model';
import { TermanGeneralResults } from './models/TermanGeneralResults.model';
import { LeyesGeneralResults } from './models/LeyesGeneralResults.model';
import { TenantModule } from 'src/tenant/tenant.module';
import { ExecuteTestModule } from 'src/executeTest/executeTest.module';

@Module({
    controllers: [ReportsController],
    providers: [ReportsService],
    imports: [
        TypeOrmModule.forFeature([
            BelbinGeneralResults,
            MBTIGeneralResults,
            TEGeneralResults,
            TestAppCount,
            TestResultAnalysis,
            PreferredAvoidedRoles,
            CIGeneralResults,
            TermanGeneralResults,
            LeyesGeneralResults,
        ]),
        TenantModule,
        ExecuteTestModule,
    ],
    exports: [],
})
export class ReportsModule {}
