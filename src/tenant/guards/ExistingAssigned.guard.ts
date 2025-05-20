import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { AuthAssignment } from '../models/auth_assignment.entity';

@Injectable()
export class ExistingAssignedGuard implements CanActivate {
    @Inject(AuthAssignmentService) authAssignmentService: AuthAssignmentService;
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const body = request.body;

        let assignment = null;
        if (Array.isArray(body)) {
            const repository = AuthAssignment.getRepository();
            let query = repository.createQueryBuilder();

            (body as []).forEach((el: any) => {
                query = query.orWhere({
                    user_id: el.user_id,
                    group_id: el.group_id,
                    item_id: el.item_id,
                });
            });
            assignment = await query.getMany();
        } else {
            assignment = this.authAssignmentService.getOne({
                where: body,
            });
        }

        return assignment == false || assignment === null;
    }
}
