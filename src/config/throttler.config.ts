import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig = (
    config: ConfigService,
): ThrottlerModuleOptions => {
    return {
        throttlers: [
            {
                ttl: config.get<number>('THROTTLER_TTL'),
                limit: config.get<number>('THROTTLER_LIMIT'),
            },
        ],
    };
};
