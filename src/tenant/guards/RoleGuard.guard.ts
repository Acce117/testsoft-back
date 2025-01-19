import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/tenant/services/user.service';
import { jwtPayload } from '../../common/decorators/jwtPayload.decorator';
import { User } from 'src/tenant/models/user.entity';

export const Roles = Reflector.createDecorator<string[]>();
@Injectable()
export class RoleGuard implements CanActivate {
    @Inject(UserService) userService: UserService;

    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.getRoles(context);
        let result = true;
        const payload = jwtPayload(context);

        const user: User = await this.userService.getOne(
            {
                relations: ['assignments.role'],
            },
            payload.user_id,
        );

        if (roles.length > 0) {
            result =
                user.assignments.find((assignment) =>
                    roles.includes(assignment.role.name),
                ) !== undefined;
        }

        return result;
    }

    getRoles(context: ExecutionContext) {
        return [
            ...(this.reflector.get(Roles, context.getClass()) ?? []),
            ...(this.reflector.get(Roles, context.getHandler()) ?? []),
        ];
    }
}
