import { PsiTestDto } from '../dto/psiTest.dto';
import { PsiTestService } from '../services/psiTest.service';
import { CrudBaseController } from 'src/common/controllers/controller';

export class PsiTestController extends CrudBaseController(
    'psi_test',
    PsiTestService,
    PsiTestDto,
) {}
