import { CrudBaseController } from 'src/common/controllers/controller';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { ExistingAssignedGuard } from '../guards/ExistingAssigned.guard';
import { MyAuthAssignmentInterceptor } from '../interceptors/myAuthAssignments.interceptor';
import { RoleGuard, Roles } from '../guards/RoleGuard.guard';

export class AuthAssignmentController extends CrudBaseController({
    prefix: 'auth_assignment',
    service: AuthAssignmentService,
    decorators: [
        UseGuards(RoleGuard),
        Roles(['Super Admin', 'Client', 'Admin', 'Analyst']),
    ],
    create: {
        decorators: [UseGuards(ExistingAssignedGuard)],
    },
    getAll: {
        decorators: [UseInterceptors(MyAuthAssignmentInterceptor)],
    },
}) {
    // @Delete()
    // async delete(@JwtPayload() payload) {
    //     const auth_assignment = await (
    //         this.service as AuthAssignmentService
    //     ).getOne({
    //         where: {
    //             user_id: payload.user_id,
    //             group_id: payload.group,
    //         },
    //     });

    //     return handleTransaction(this.dataSource, (manager) => {
    //         return (this.service as AuthAssignmentService).delete(
    //             auth_assignment.assignment_id,
    //             manager,
    //         );
    //     });
    // }
}
