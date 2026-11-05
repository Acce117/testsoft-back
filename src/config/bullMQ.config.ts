import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

export const bullConfig = (config: ConfigService): BullRootModuleOptions => {
    return {
        connection: {
            host: config.get('REDIS_HOST'),
            port:
                Number.parseInt(config.get('REDIS_PORT') ?? '6379', 10) || 6379,
            password: config.get('REDIS_PASSWORD') || undefined,
        },
    };
};
