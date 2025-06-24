import { CrudBaseController } from 'src/common/controllers/controller';
import { AuthAssignmentService } from '../services/AuthAssignment.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
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
}) {}
