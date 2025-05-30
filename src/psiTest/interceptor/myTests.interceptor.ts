import {
    CallHandler,
    ExecutionContext,
    Inject,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { UserService } from 'src/tenant/services/user.service';
import { GroupService } from 'src/tenant/services/group.service';
import { User } from 'src/tenant/models/user.entity';
import { PsiTest } from '../models/psiTest.entity';

export class MyTestsInterceptor implements NestInterceptor {
    @Inject(UserService) userService: UserService;
    @Inject(GroupService) groupService: GroupService;

    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const { user_id, group = null } = jwtPayload(context);

        return next.handle().pipe(
            map(async (value) => {
                const user: User = await this.userService.getOne(
                    {
                        relations: ['assignments.role'],
                    },
                    user_id,
                );

                const groups = await this.groupService.getAncestors({}, group);

                const filtered = [];

                if (user.assignments.find((a) => a.role.name !== 'Super Admin'))
                    value.data.forEach((element: PsiTest) => {
                        if ([3, 4, 7, 12, 14, 15].includes(element.id_test))
                            filtered.push(element);
                        else if (element.id_owner === groups[0].id_group) {
                            filtered.push(element);
                        }
                    });

                value.data = filtered;

                return value;
            }),
        );
    }
}
