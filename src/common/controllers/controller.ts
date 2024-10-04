import {
    Body,
    ClassSerializerInterceptor,
    Get,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { AbstractService } from '../services/service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IController } from './controller.interface';

export class BaseController implements IController {
    service: AbstractService;
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
    async create(@Body() body) {
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
