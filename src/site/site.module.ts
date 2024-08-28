import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteController } from './controllers/site.controller';
import { SiteService } from './services/site.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/common/middlewares/jwtMiddleware';
import jwtConfig from 'src/config/jwt.config';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
    controllers: [SiteController],
    providers: [SiteService],
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: jwtConfig,
            inject: [ConfigService],
        }),

        TenantModule,
    ],
    exports: [TypeOrmModule],
})
export class SiteModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        /*consumer
            .apply(JwtMiddleware)
            .exclude(
                { path: 'login', method: RequestMethod.POST },
                { path: 'sign_in', method: RequestMethod.POST },
            )
            .forRoutes('/', 'user');*/
    }
}
