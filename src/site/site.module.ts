import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteController } from './controllers/site.controller';
import { SiteService } from './services/site.service';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig from 'src/config/jwt.config';
import { TenantModule } from 'src/tenant/tenant.module';
import { MeService } from './services/me.service';
import { MeController } from './controllers/me.controller';
import { SendMailModule } from 'src/mailer/sendMail.module';

@Module({
    controllers: [SiteController, MeController],
    providers: [SiteService, MeService],
    imports: [
        SendMailModule,
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
export class SiteModule {}
