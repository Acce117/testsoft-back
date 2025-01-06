import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Type,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICrudController } from './controller.interface';
import { ICrudService } from '../services/service.interface';
import { ValidateDtoPipe } from '../pipes/validateDto.pipe';
import { instanceToPlain } from 'class-transformer';
import { handleTransaction } from '../utils/handleTransaction';

export function CrudBaseController(
    prefix: string,
    service: object,
    createDto: any = null,
    updateDto: any = null,
): Type<ICrudController> {
    @Controller(prefix)
    class CrudController implements ICrudController {
        @Inject(service) service: ICrudService;
        @InjectDataSource() dataSource: DataSource;

        @Get()
        async getAll(@Query() params, @Body() body) {
            let result = null;
            try {
                result = await this.service.getAll({
                    ...params,
                    ...body,
                });
                result = instanceToPlain(result);
            } catch (err) {
                result = err.message;
            }

            return result;
        }

        @Get(':id')
        async getOne(@Param('id') id: number, @Query() params, @Body() body) {
            let result = null;
            try {
                result = await this.service.getOne({ ...params, ...body }, id);
                result = instanceToPlain(result);
            } catch (err) {
                result = err.message;
            }

            return result;
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
            @Body(new ValidateDtoPipe(updateDto)) body,
        ) {
            return await handleTransaction(this.dataSource, async () => {
                const result = await this.service.update(id, body);
                return instanceToPlain(result);
            });
        }
    }

    return CrudController;
}
