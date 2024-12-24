import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Type,
    UseInterceptors,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IController } from './controller.interface';
import { ICrudService } from '../services/service.interface';
import { ValidateDtoPipe } from '../pipes/validateDto.pipe';
import { instanceToPlain } from 'class-transformer';
import { handleTransaction } from '../utils/handleTransaction';

export function CrudBaseController(
    prefix: string,
    service: object,
    createDto: any = null,
): Type<IController> {
    @Controller(prefix)
    class CrudController implements IController {
        @Inject(service) service: ICrudService;
        @InjectDataSource() dataSource: DataSource;

        @Get()
        @UseInterceptors(ClassSerializerInterceptor)
        async getAll(@Body() params) {
            try {
                const result = await this.service.getAll(params);
                return instanceToPlain(result);
            } catch (err) {
                console.log(err.message);
            }
        }

        @Get(':id')
        async getOne(@Param('id') id: number, @Query() params) {
            try {
                const result = await this.service.getOne(params, id);
                return instanceToPlain(result);
            } catch (err) {
                console.log(err.message);
            }
        }

        @Post()
        async create(@Body(new ValidateDtoPipe(createDto)) body) {
            return await handleTransaction(this.dataSource, async () => {
                const result = await this.service.create(body);
                return instanceToPlain(result);
            });
        }

        @Patch(':id')
        async update(
            @Param('id') id: number,
            @Body(new ValidateDtoPipe(null)) body,
        ) {
            return await handleTransaction(this.dataSource, async () => {
                const result = await this.service.update(id, body);
                return instanceToPlain(result);
            });
        }
    }

    return CrudController;
}
