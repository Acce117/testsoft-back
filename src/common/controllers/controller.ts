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

interface EndPointOptions {
    decorators: Array<MethodDecorator>;
}
interface BaseControllerOptions {
    prefix: string;
    service: object;
    createDto?: any;
    updateDto?: any;
    getAll?: EndPointOptions;
    getOne?: EndPointOptions;
    create?: EndPointOptions;
    update?: EndPointOptions;
}

export function CrudBaseController(
    options: BaseControllerOptions,
): Type<ICrudController> {
    @Controller(options.prefix)
    class CrudController implements ICrudController {
        @Inject(options.service) service: ICrudService;
        @InjectDataSource() dataSource: DataSource;

        @Get()
        @applyDecorators(
            ...(options.getAll?.decorators ? options.getAll.decorators : []),
        )
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
        @applyDecorators(
            ...(options.getOne?.decorators ? options.getOne.decorators : []),
        )
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
        @applyDecorators(
            ...(options.create?.decorators ? options.create.decorators : []),
        )
        async create(@Body(new ValidateDtoPipe(options.createDto)) body) {
            return await handleTransaction(this.dataSource, async () => {
                const result = await this.service.create(body);
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
            return await handleTransaction(this.dataSource, async () => {
                const result = await this.service.update(id, body);
                return instanceToPlain(result);
            });
        }

        @Delete(':id')
        public async delete(@Param('id') id: number) {
            return await handleTransaction(this.dataSource, async () => {
                return await this.service.delete(id);
            });
        }
    }

    return CrudController;
}
