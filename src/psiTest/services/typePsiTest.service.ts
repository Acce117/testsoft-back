import { CrudBaseService } from 'src/common/services/service';
import { TypePsiTest } from '../models/typePsiTest.entity';

export class TypePsiTestService extends CrudBaseService({
    model: TypePsiTest,
}) {}
