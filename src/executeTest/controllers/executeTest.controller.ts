import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ExecuteTestService } from '../services/executeTest.service';
import { ExecuteTestDto } from '../dto/executeTest.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { IController } from 'src/common/controllers/controller.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('execute_test')
export class ExecuteTestController implements IController {
    @Inject(ExecuteTestService) service: ExecuteTestService;
    @InjectDataSource() dataSource?: DataSource;

    @Post('execute_Test')
    async executeTest(
        @Body() params: ExecuteTestDto,
        @JwtPayload() jwtPayload,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        let result = null;

        try {
            queryRunner.startTransaction();

            params.user_id = jwtPayload.user_id;

            result = await this.service.executeTest(params);

            queryRunner.commitTransaction();
        } catch (err) {
            queryRunner.rollbackTransaction();
            result = err;
        }

        return result;
    }
}
