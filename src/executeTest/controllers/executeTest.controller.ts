import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ExecuteTestService } from '../services/executeTest.service';
import { ExecuteTestDto } from '../dto/executeTest.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TestApplicationService } from '../services/testApplication.service';

@Controller('execute_test')
export class ExecuteTestController implements IController {
    @Inject(ExecuteTestService) service: ExecuteTestService;
    @Inject(TestApplicationService) testAppService: TestApplicationService;

    @InjectDataSource() dataSource?: DataSource;

    @Post()
    async executeTest(@Body() body: ExecuteTestDto, @JwtPayload() jwtPayload) {
        const queryRunner = this.dataSource.createQueryRunner();
        let result = null;

        try {
            await queryRunner.startTransaction();

            body.user_id = jwtPayload.user_id;

            result = await this.service.executeTest(body);

            queryRunner.commitTransaction();
        } catch (err) {
            queryRunner.rollbackTransaction();
            result = err;
        }

        return result;
    }

    @Get('/:id')
    async getTestResult(@Param('id') id_test_app: number) {
        let result = null;

        try {
            const testApp = await this.testAppService.getOne(
                {
                    relations: [
                        'test.display_parameters',
                        {
                            name: 'application_result',
                            relations: [
                                {
                                    name: 'item',
                                    relations: ['ranges', 'category'],
                                },
                            ],
                        },
                        // 'application_result.item.ranges',
                    ],
                },
                id_test_app,
            );

            result = await this.service.testResult(testApp);
        } catch (e) {
            console.log(e);
        }

        return result;
    }
}
