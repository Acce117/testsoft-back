import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

export const bullConfig = (config: ConfigService): BullRootModuleOptions => {
    return {
        connection: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
        },
    };
};
