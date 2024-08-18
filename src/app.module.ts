import { Module } from '@nestjs/common';
import { SiteModule } from './site/site.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsiTestModule } from './psiTest/psiTest.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        SiteModule,
        PsiTestModule,
        CommonModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: databaseConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
