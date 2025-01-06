import { CrudBaseController } from 'src/common/controllers/controller';
import { CategoryService } from '../services/category.service';

export class CategoryController extends CrudBaseController({
    prefix: 'category',
    service: CategoryService,
}) {}
