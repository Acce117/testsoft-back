import { CrudBaseController } from 'src/common/controllers/controller';
import { TestApplicationService } from '../services/testApplication.service';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class TestApplicationController extends CrudBaseController({
    prefix: 'test_app',
    service: TestApplicationService,
    getAll: {
        decorators: [UseGuards(RoleGuard), Roles(['Analyst', 'Executor'])],
    },
}) {}
