import { CrudBaseController } from 'src/common/controllers/controller';
import { TributeService } from '../services/tribute.service';

export class TributeController extends CrudBaseController(
    'tribute',
    TributeService,
) {}
