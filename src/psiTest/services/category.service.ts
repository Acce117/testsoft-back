import { CrudBaseService } from 'src/common/services/service';
import { Category } from '../models/category.entity';

export class CategoryService extends CrudBaseService({
    model: Category,
    delete: 'hard',
}) {}
