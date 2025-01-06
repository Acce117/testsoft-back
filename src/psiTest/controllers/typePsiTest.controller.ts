import { CrudBaseController } from 'src/common/controllers/controller';
import { TypePsiTestService } from '../services/typePsiTest.service';

export class TypePsiTestController extends CrudBaseController({
    prefix: 'type_psi_test',
    service: TypePsiTestService,
}) {}
