import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { ReportsService } from '../providers/reports.service';

@Controller('reports')
export class ReportsController implements IController {
    @Inject(ReportsService) service: ReportsService;
    @Inject(DataSource) dataSource?: DataSource;

    @Get('belbin_general-results')
    async getBelbinGeneralResults(@Query('groups') groups) {
        return this.service.getBelbinGeneralResults(groups);
    }

    @Get('mbti_general-results')
    getMBTIGeneralResults(@Query('groups') groups) {
        return this.service.getMBTIGeneralResults(groups);
    }

    @Get('te_general-results')
    getTEGeneralResults(@Query('groups') groups) {
        return this.service.getTEGeneralResults(groups);
    }

    @Get('leyes_general-results')
    getLeyesGeneralResults(@Query('groups') groups) {
        return this.service.getLeyesGeneralResults(groups);
    }

    @Get('terman_general-results')
    getTermanGeneralResults(@Query('groups') groups) {
        return this.service.getTermanGeneralResults(groups);
    }

    @Get('ci_general-results')
    getCIGeneralResults(@Query('groups') groups) {
        return this.service.getCIGeneralResults(groups);
    }

    @Get('test_app_count')
    getTestAppCount() {
        return this.service.getTestAppCount();
    }

    @Get('test_result_analysis')
    getTestResultAnalysis() {
        return this.service.getTestResultAnalysis();
    }

    @Get('tested_in_group')
    amountOfTestedInAGroup(@Query('groups') groups) {
        return this.service.amountOfTestedInGroup(groups);
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
