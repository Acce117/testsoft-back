import {
    CallHandler,
    ExecutionContext,
    Inject,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map, of } from 'rxjs';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { User } from '../models/user.entity';
import { UserService } from '../services/user.service';
import { Response } from 'express';

export class MyGroupInterceptor implements NestInterceptor {
    @Inject(UserService) userService: UserService;

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const payload = jwtPayload(context);

        const user: User = await this.userService.getOne(
            {
                relations: ['assignments.role'],
            },
            payload.user_id,
        );

        if (
            user.assignments.find(
                (element) => element.role.name === 'Super Admin',
            )
        ) {
            return next
                .handle()
                .pipe(map((response) => this.extractGroup(response, user)));
        } else {
            const splittedUrl = (
                context.switchToHttp().getRequest() as Request
            ).url.split('?');
            (context.switchToHttp().getResponse() as Response).redirect(
                `/groups/${payload.group}?${splittedUrl.length > 1 ? splittedUrl[1] : ''}`,
            );

            return of(null);
        }
    }

    private extractGroup(response, user: User) {
        const result = response;

        if (
            !user.assignments.find(
                (element) => element.role.name === 'Super Admin',
            )
        ) {
        }

        return result;
    }
}
