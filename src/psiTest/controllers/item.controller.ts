import { CrudBaseController } from 'src/common/controllers/controller';
import { ItemService } from '../services/item.service';

export class ItemController extends CrudBaseController({
    prefix: 'item',
    service: ItemService,
}) {}
