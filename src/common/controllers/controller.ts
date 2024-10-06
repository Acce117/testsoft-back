import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Type,
    UseInterceptors,
} from '@nestjs/common';
import { AbstractService } from '../services/service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IController } from './controller.interface';
import { IService } from '../services/service.interface';
import { ValidateDtoPipe } from '../pipes/validateDto.pipe';

export function CrudBaseController(
    prefix: string,
    service: IService,
    createDto: any = null,
): Type<IController> {
    @Controller(prefix)
    class CrudController implements IController {
        @Inject(service) service: AbstractService;
        @InjectDataSource() dataSource: DataSource;

        @Get()
        @UseInterceptors(ClassSerializerInterceptor)
        async getAll(@Body() params) {
            try {
                return await this.service.getAll(params);
            } catch (err) {
                console.log(err.message);
            }
        }

        @Get(':id')
        async getOne(@Param('id') id: number, @Body() params) {
            try {
                return await this.service.getOne(params, id);
            } catch (err) {
                console.log(err.message);
            }
        }

        @Post()
        async create(@Body(new ValidateDtoPipe(createDto)) body) {
            const queryRunner = this.dataSource.createQueryRunner();

            let result = null;
            try {
                await queryRunner.startTransaction();

                result = await this.service.create(body);

                queryRunner.commitTransaction();
            } catch (err) {
                await queryRunner.rollbackTransaction();
                result = err;
            }

            return result;
        }
    }

    return CrudController;
}
