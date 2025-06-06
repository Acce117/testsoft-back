import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

const jwtConfig = (config: ConfigService): JwtModule => ({
    global: true,
    secret: config.get('JWT_SECRET'),
    signOptions: {
        expiresIn: '3h',
    },
});

export default jwtConfig;
