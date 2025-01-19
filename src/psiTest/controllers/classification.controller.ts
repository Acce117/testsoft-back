import { CrudBaseController } from 'src/common/controllers/controller';
import { ClassificationService } from '../services/classification.service';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/common/guards/RoleGuard.guard';

export class ClassificationController extends CrudBaseController({
    prefix: 'classification',
    service: ClassificationService,
    decorators: [UseGuards(RoleGuard), Roles(['Analyst'])],
}) {}
