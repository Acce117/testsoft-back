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
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/common/middlewares/jwtMiddleware';
import jwtConfig from 'src/config/jwt.config';

@Module({
    controllers: [SiteController, UserController],
    providers: [SiteService, UserService],
    imports: [
        ConfigModule,
        JwtModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: jwtConfig,
            inject: [ConfigService],
        }),
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
