import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { Group } from 'src/tenant/models/group.entity';
import { GroupService } from 'src/tenant/services/group.service';
import { PsiTestService } from '../services/psiTest.service';
import { PsiTest } from '../models/psiTest.entity';

@Injectable()
export class AllowAssignTestGuard implements CanActivate {
    @Inject(GroupService) groupService: GroupService;
    @Inject(PsiTestService) psiTestService: PsiTestService;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { group } = jwtPayload(context);
        const request: Request = context.switchToHttp().getRequest();
        const { id_test } = request.body;

        const rootGroup: Group = (
            await this.groupService.getAncestors({}, parseInt(group))
        )[0];

        const psiTest: PsiTest = await this.psiTestService.getOne({}, id_test);

        return (
            psiTest.id_owner === null || psiTest.id_owner == rootGroup.id_group
        );
    }
}
