import { CrudBaseController } from 'src/common/controllers/controller';
import { AuthAssignmentService } from '../services/AuthAssignment.service';

export class AuthAssignmentController extends CrudBaseController({
    prefix: 'auth_assignment',
    service: AuthAssignmentService,
}) {}
