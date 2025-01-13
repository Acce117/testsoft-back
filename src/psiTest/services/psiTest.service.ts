import { PsiTest } from '../models/psiTest.entity';
import { CrudBaseService } from 'src/common/services/service';

export class PsiTestService extends CrudBaseService({ model: PsiTest }) {}
