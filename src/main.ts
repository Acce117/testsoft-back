import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    // abortOnError: false permite registrar el error de arranque antes de
    // terminar el proceso, en lugar de que Nest salga directamente.
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        abortOnError: false,
    });

    // CapRover/nginx esta delante de la API.
    app.set('trust proxy', 1);

    app.enableCors({
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
            : true,
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // CapRover enruta al puerto 80 del contenedor por defecto.
    // PORT permite usar otro puerto en desarrollo local.
    const port = Number.parseInt(process.env.PORT ?? '80', 10) || 80;
    await app.listen(port, '0.0.0.0');
    console.log(`API listening on port ${port}`);
}

bootstrap().catch((error) => {
    console.error('Startup failed', error);
    process.exit(1);
});
