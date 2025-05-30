import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { ReportsService } from '../providers/reports.service';

@Controller('reports')
export class ReportsController implements IController {
    @Inject(ReportsService) service: ReportsService;
    @Inject(DataSource) dataSource?: DataSource;

    @Get('belbin_general-results/:group_id')
    async getBelbinGeneralResults(@Param('group_id') group_id) {
        return this.service.getBelbinGeneralResults(group_id);
    }

    @Get('mbti_general-results/:group_id')
    getMBTIGeneralResults(@Param('group_id') group_id) {
        return this.service.getMBTIGeneralResults(group_id);
    }

    @Get('te_general-results/:group_id')
    getTEGeneralResults(@Param('group_id') group_id) {
        return this.service.getTEGeneralResults(group_id);
    }

    @Get('leyes_general-results/:group_id')
    getLeyesGeneralResults(@Param('group_id') group_id) {
        return this.service.getLeyesGeneralResults(group_id);
    }

    @Get('terman_general-results/:group_id')
    getTermanGeneralResults(@Param('group_id') group_id) {
        return this.service.getTermanGeneralResults(group_id);
    }

    @Get('ci_general-results/:group_id')
    getCIGeneralResults(@Param('group_id') group_id) {
        return this.service.getCIGeneralResults(group_id);
    }

    @Get('test_app_count')
    getTestAppCount() {
        return this.service.getTestAppCount();
    }

    @Get('test_result_analysis')
    getTestResultAnalysis() {
        return this.service.getTestResultAnalysis();
    }

    @Get('tested_in_group/:group_id')
    amountOfTestedInAGroup(@Param('group_id') group_id) {
        return this.service.amountOfTestedInGroup(group_id);
    }

    @Get('preferred_avoided_roles/:group_id')
    preferredAvoidedRoles(@Param('group_id') group_id) {
        return this.service.preferredAvoidedRoles(group_id);
    }

    @Get('most_considered/:group_id')
    mostConsidered(@Param('group_id') group_id) {
        return this.service.mostConsidered(group_id);
    }
}
