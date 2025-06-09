import { Controller } from '@nestjs/common';
import { CrudBaseController } from 'src/common/controllers/controller';
import { ClientService } from '../services/client.service';

@Controller('client')
export class ClientController extends CrudBaseController({
    prefix: 'client',
    service: ClientService,
}) {}
