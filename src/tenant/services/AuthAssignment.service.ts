import { CrudBaseService } from 'src/common/services/service';
import { AuthAssignment } from '../models/auth_assignment.entity';

export class AuthAssignmentService extends CrudBaseService({
    model: AuthAssignment,
}) {}
