import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { SiteModule } from './site/site.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsiTestModule } from './psiTest/psiTest.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { ExecuteTestModule } from './executeTest/executeTest.module';
import { FileStreamerModule } from './fileStreamer/fileStreamer.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './config/throttler.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { BullModule } from '@nestjs/bullmq';
import { bullConfig } from './config/bullMQ.config';
import { SendMailModule } from './mailer/sendMail.module';
import { ReportsModule } from './reports/reports.module';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtMiddleware } from './common/middlewares/jwtMiddleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({ global: true }),
        CacheModule.register({ isGlobal: true }),
        ReportsModule,
        SiteModule,
        PsiTestModule,
        TenantModule,
        ExecuteTestModule,
        CommonModule,
        SendMailModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: databaseConfig,
            inject: [ConfigService],
        }),
        FileStreamerModule,
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: throttlerConfig,
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: mailerConfig,
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: bullConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .exclude(
                { path: 'login', method: RequestMethod.POST },
                { path: 'sign_in', method: RequestMethod.POST },
            )
            .forRoutes('*');
    }
}
