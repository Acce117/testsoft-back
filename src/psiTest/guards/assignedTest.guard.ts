import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { GroupService } from 'src/tenant/services/group.service';

@Injectable()
export class AssignedTestGuard implements CanActivate {
    @Inject(GroupService) groupService: GroupService;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let result: boolean =
            context['user'].assignments.find(
                (a) => a.role.name == 'Analyst',
            ) !== undefined;

        if (!result) {
            const request: Request = context.switchToHttp().getRequest();
            const id = request.params['id_test'];

            const payload = jwtPayload(context);

            if (payload.group) {
                const group = await this.groupService.getOne(
                    {
                        relations: ['psiTests'],
                    },
                    payload.group,
                );

                const test = group.psiTests.find((test) => test.id_test == id);
                result = test !== undefined;
            }
        }
        return result;
    }
}
