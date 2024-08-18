import {
    Body,
    ClassSerializerInterceptor,
    Get,
    Inject,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { AbstractService } from '../services/service';

export function BaseController(service) {
    class AbstractController {
        @Inject(service) service: AbstractService;

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
            return await this.service.create(body);
        }
    }

    return AbstractController;
}
