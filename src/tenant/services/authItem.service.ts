import { CrudBaseService } from 'src/common/services/service';
import { AuthItem } from '../models/auth_item.entity';

export class AuthItemService extends CrudBaseService({
    model: AuthItem,
}) {}
