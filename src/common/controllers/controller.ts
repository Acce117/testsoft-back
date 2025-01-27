import {
    applyDecorators,
    Body,
    Controller,
    Delete,
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
import { QueryBuilderPipe } from '../pipes/queryBuilder.pipe';

interface EndPointOptions {
    decorators?: Array<MethodDecorator>;
}
interface BaseControllerOptions extends EndPointOptions {
    prefix: string;
    service: object;
    createDto?: any;
    updateDto?: any;
    getAll?: EndPointOptions;
    getOne?: EndPointOptions;
    create?: EndPointOptions;
    update?: EndPointOptions;
    delete?: EndPointOptions;
}

export function CrudBaseController(
    options: BaseControllerOptions,
): Type<ICrudController> {
    @applyDecorators(...(options.decorators ?? []))
    @Controller(options.prefix)
    class CrudController implements ICrudController {
        @Inject(options.service) service: ICrudService;
        @InjectDataSource() dataSource: DataSource;

        @Get()
        @applyDecorators(
            ...(options.getAll?.decorators ? options.getAll.decorators : []),
        )
        async getAll(@Query(new QueryBuilderPipe()) params, @Body() body) {
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
        @applyDecorators(
            ...(options.getOne?.decorators ? options.getOne.decorators : []),
        )
        async getOne(
            @Param('id') id: number,
            @Query(new QueryBuilderPipe()) params,
            @Body() body,
        ) {
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
        @applyDecorators(
            ...(options.create?.decorators ? options.create.decorators : []),
        )
        create(@Body(new ValidateDtoPipe(options.createDto)) body) {
            return handleTransaction(this.dataSource, async (manager) => {
                const result = await this.service.create(body, manager);
                return instanceToPlain(result);
            });
        }

        @Patch(':id')
        @applyDecorators(
            ...(options.update?.decorators ? options.update.decorators : []),
        )
        async update(
            @Param('id') id: number,
            @Body(new ValidateDtoPipe(options.updateDto)) body,
        ) {
            return handleTransaction(this.dataSource, async (manager) => {
                const result = await this.service.update(id, body, manager);
                return instanceToPlain(result);
            });
        }

        @Delete(':id')
        @applyDecorators(
            ...(options.delete?.decorators ? options.delete.decorators : []),
        )
        public async delete(@Param('id') id: number) {
            return handleTransaction(this.dataSource, async (manager) => {
                const result = await this.service.delete(id, manager);
                return instanceToPlain(result);
            });
        }
    }

    return CrudController;
}
