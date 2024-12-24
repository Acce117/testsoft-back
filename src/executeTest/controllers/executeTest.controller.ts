import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ExecuteTestService } from '../services/executeTest.service';
import { ExecuteTestDto } from '../dto/executeTest.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TestApplicationService } from '../services/testApplication.service';
import { handleTransaction } from 'src/common/utils/handleTransaction';

@Controller('execute_test')
export class ExecuteTestController implements IController {
    @Inject(ExecuteTestService) service: ExecuteTestService;
    @Inject(TestApplicationService) testAppService: TestApplicationService;

    @InjectDataSource() dataSource?: DataSource;

    @Post()
    async executeTest(@Body() body: ExecuteTestDto, @JwtPayload() jwtPayload) {
        // const queryRunner = this.dataSource.createQueryRunner();
        // let result = null;

        // try {
        //     await queryRunner.startTransaction();

        //     body.user_id = jwtPayload.user_id;

        //     result = await this.service.executeTest(body);

        //     queryRunner.commitTransaction();

        //     result = await this.service.getResult(result);
        // } catch (err) {
        //     queryRunner.rollbackTransaction();
        //     result = err.message;
        // }

        // return result;

        return await handleTransaction(this.dataSource, async () => {
            body.user_id = jwtPayload.user_id;
            const result = await this.service.executeTest(body);

            return await this.service.getResult(result);
        });
    }

    @Get('/:id')
    async getTestResult(@Param('id') id_test_app: number) {
        let result = null;

        try {
            result = this.service.getResult(id_test_app);
        } catch (e) {
            console.log(e);
        }

        return result;
    }
}
