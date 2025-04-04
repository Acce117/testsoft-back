import { Controller, Get, Inject } from '@nestjs/common';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { ReportsService } from '../providers/reports.service';

@Controller('reports')
export class ReportsController implements IController {
    @Inject(ReportsService) service: ReportsService;
    @Inject(DataSource) dataSource?: DataSource;

    @Get('belbin_general-results')
    getBelbinGeneralResults() {
        return this.service.getBelbinGeneralResults();
    }

    @Get('mbti_general-results')
    getMBTIGeneralResults() {
        return this.service.getMBTIGeneralResults();
    }

    @Get('te_general-results')
    getTEGeneralResults() {
        return this.service.getTEGeneralResults();
    }

    @Get('test_app_count')
    getTestAppCount() {
        return this.service.getTestAppCount();
    }

    @Get('test_result_analysis')
    getTestResultAnalysis() {
        return this.service.getTestResultAnalysis();
    }
}
