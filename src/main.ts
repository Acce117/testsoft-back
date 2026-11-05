import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createServer } from 'http';
import { createHash } from 'crypto';
import { hostname } from 'os';

// Ruta temporal de diagnostico. Se retira una vez validado el despliegue.
const DIAG_PATH = '/__diag_7f3a9c1e';
// SHA-256 del token que debe venir en x-diag-token. El token no esta en el repo.
const DIAG_TOKEN_HASH =
    'b25bdcc614606771d592372411a33718aecacb55bf0d3f2ff872e6baefac3377';

function envSummary() {
    const env = process.env;
    const len = (value?: string) => (value ? value.length : 0);

    return {
        DB_HOST: env.DB_HOST ?? null,
        DB_PORT: env.DB_PORT ?? null,
        DB_NAME: env.DB_NAME ?? null,
        DB_USERNAME: env.DB_USERNAME ?? null,
        DB_PASSWORD_LENGTH: len(env.DB_PASSWORD),
        DB_POOL_SIZE: env.DB_POOL_SIZE ?? null,
        DB_LOGGING: env.DB_LOGGING ?? null,
        REDIS_HOST: env.REDIS_HOST ?? null,
        REDIS_PORT: env.REDIS_PORT ?? null,
        REDIS_PASSWORD_LENGTH: len(env.REDIS_PASSWORD),
        JWT_SECRET_LENGTH: len(env.JWT_SECRET),
        HASH_SALT: env.HASH_SALT ?? null,
        THROTTLER_TTL: env.THROTTLER_TTL ?? null,
        THROTTLER_LIMIT: env.THROTTLER_LIMIT ?? null,
        PORT: env.PORT ?? null,
        DOMAIN: env.DOMAIN ?? null,
        NODE_ENV: env.NODE_ENV ?? null,
        FRONT_DOMAIN: env.FRONT_DOMAIN ?? null,
        CORS_ORIGIN: env.CORS_ORIGIN ?? null,
        envKeys: Object.keys(env)
            .filter((key) => !/PASSWORD|SECRET|TOKEN/i.test(key))
            .sort(),
    };
}

function startDiagnostics(error: unknown) {
    const err = error as {
        name?: string;
        message?: string;
        code?: string;
        sqlMessage?: string;
        sqlState?: string;
        errno?: number;
        stack?: string;
    };

    const payload = {
        status: 'startup-failed',
        hostname: hostname(),
        error: {
            name: err?.name ?? null,
            message: err?.message ?? String(error),
            code: err?.code ?? null,
            errno: err?.errno ?? null,
            sqlMessage: err?.sqlMessage ?? null,
            sqlState: err?.sqlState ?? null,
            stack: err?.stack?.split('\n').slice(0, 12) ?? null,
        },
        env: envSummary(),
    };

    const body = JSON.stringify(payload, null, 2);
    const server = createServer((req, res) => {
        const providedToken = req.headers['x-diag-token'];
        const tokenMatches =
            typeof providedToken === 'string' &&
            createHash('sha256').update(providedToken).digest('hex') ===
                DIAG_TOKEN_HASH;

        if (!tokenMatches || (req.url ?? '').split('?')[0] !== DIAG_PATH) {
            res.writeHead(404, { 'content-type': 'text/plain' });
            res.end('Not found');
            return;
        }

        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(body);
    });

    server.on('error', (serverError) => {
        // Si tampoco se puede abrir el puerto, al menos dejamos rastro.
        console.error('Diagnostics server failed', serverError);
    });

    server.listen(80, '0.0.0.0', () => {
        console.error(`Diagnostics available at ${DIAG_PATH}`);
    });
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
    startDiagnostics(error);
});
