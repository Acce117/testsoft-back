import { CrudBaseController } from 'src/common/controllers/controller';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { Delete, UseGuards } from '@nestjs/common';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { ExistingAssignedGuard } from '../guards/ExistingAssigned.guard';

export class AuthAssignmentController extends CrudBaseController({
    prefix: 'auth_assignment',
    service: AuthAssignmentService,
    create: {
        decorators: [UseGuards(ExistingAssignedGuard)],
    },
}) {
    @Delete()
    async delete(@JwtPayload() payload) {
        const auth_assignment = await (
            this.service as AuthAssignmentService
        ).getOne({
            where: {
                user_id: payload.user_id,
                group_id: payload.group,
            },
        });

        return handleTransaction(this.dataSource, (manager) => {
            return (this.service as AuthAssignmentService).delete(
                auth_assignment.assignment_id,
                manager,
            );
        });
    }
}
