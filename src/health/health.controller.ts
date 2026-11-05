import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    @Get()
    @SkipThrottle()
    async check() {
        try {
            await this.dataSource.query('SELECT 1');
            return { status: 'ok', db: 'up' };
        } catch {
            throw new ServiceUnavailableException({
                status: 'error',
                db: 'down',
            });
        }
    }
}
