import { Module } from '@nestjs/common';
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

@Module({
    imports: [
        SiteModule,
        PsiTestModule,
        TenantModule,
        ExecuteTestModule,
        CommonModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: databaseConfig,
            inject: [ConfigService],
        }),
        FileStreamerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
