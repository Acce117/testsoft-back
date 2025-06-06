import {
    CallHandler,
    ExecutionContext,
    Inject,
    NestInterceptor,
} from '@nestjs/common';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { AuthAssignment } from '../models/auth_assignment.entity';
import { GroupService } from '../services/group.service';
import { Group } from '../models/group.entity';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class MyAuthAssignmentInterceptor implements NestInterceptor {
    @Inject(AuthAssignmentService) authAssignmentService: AuthAssignmentService;
    @Inject(GroupService) groupService: GroupService;
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const { user_id, group = null } = jwtPayload(context);

        const request: Request = context.switchToHttp().getRequest();

        if (group !== null) {
            const assignments: AuthAssignment =
                await this.authAssignmentService.getOne({
                    relations: ['role'],
                    where: {
                        user_id,
                        group_id: group,
                    },
                });

            if (
                assignments.role.name == 'Analyst' ||
                assignments.role.name == 'Admin' ||
                assignments.role.name == 'Client'
            ) {
                const groups: Group[] = await this.groupService.getDescendants(
                    {},
                    group,
                );

                const body = request.body;
                if (!body.where) body.where = {};
                else body.where['group_id'] = groups.map((g) => g.id_group);
            }
        }

        return next.handle().pipe();
    }
}
