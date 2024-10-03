import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const jwt = request.headers.authorization.split(' ')[1];

        return JSON.parse(atob(jwt.split('.')[1]));
    },
);
