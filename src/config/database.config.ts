import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserSubscriber } from 'src/tenant/models/user.subscriber';

const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => {
    return {
        type: 'mariadb',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get('DB_NAME'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        logging: true,
        autoLoadEntities: true,
        synchronize: false,
        subscribers: [UserSubscriber],
    };
};

export default databaseConfig;
