import { CrudBaseService } from 'src/common/services/service';
import { Client } from '../models/client.entity';

export class ClientService extends CrudBaseService({
    model: Client,
}) {}
