import { CrudBaseService } from 'src/common/services/service';
import { Item } from '../models/item.entity';

export class ItemService extends CrudBaseService({
    model: Item,
    delete: 'hard',
}) {}
