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
import { Group } from 'src/tenant/models/group.entity';

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
                const groups: Group[] = await this.groupService.getAncestors(
                    {},
                    group,
                );

                const user: User = await this.userService.getOne(
                    {
                        relations: [
                            {
                                name: 'assignments',
                                relations: ['role'],
                                where: {
                                    group_id: [
                                        ...groups.map((g) => g.id_group),
                                        null,
                                    ],
                                    // or: {
                                    //     group_id: groups.map((g) => g.id_group),
                                    //     role: {
                                    //         name: 'Super Admin',
                                    //     },
                                    // },
                                },
                            },
                        ],
                    },
                    user_id,
                );

                const filtered = [];

                if (
                    !user.assignments.find((a) => a.role.name === 'Super Admin')
                )
                    value.data.forEach((element: PsiTest) => {
                        if ([3, 4, 7, 12, 14, 15].includes(element.id_test))
                            filtered.push(element);
                        else if (element.id_owner === groups[0].id_group) {
                            if (
                                user.assignments.find(
                                    (a) =>
                                        a.role.name === 'Analyst' ||
                                        a.role.name === 'Client' ||
                                        a.role.name === 'Admin',
                                )
                            )
                                filtered.push(element);
                            if (
                                user.assignments.find(
                                    (a) => a.role.name === 'Executor',
                                )
                            )
                                if (
                                    groups[groups.length - 1].psiTests.find(
                                        (t) => t.id_test === element.id_test,
                                    )
                                )
                                    filtered.push(element);
                        }
                    });

                value.data = filtered;

                return value;
            }),
        );
    }
}
