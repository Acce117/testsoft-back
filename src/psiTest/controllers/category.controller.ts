import { CrudBaseController } from 'src/common/controllers/controller';
import { CategoryService } from '../services/category.service';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class CategoryController extends CrudBaseController({
    prefix: 'category',
    service: CategoryService,
    decorators: [UseGuards(RoleGuard), Roles(['Analyst'])],
}) {}
