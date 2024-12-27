import { CreatePsiTestDto } from '../dto/create_psiTest.dto';
import { UpdatePsiTestDto } from '../dto/update_psiTest.dto';
import { PsiTestService } from '../services/psiTest.service';
import { CrudBaseController } from 'src/common/controllers/controller';

export class PsiTestController extends CrudBaseController(
    'psi_test',
    PsiTestService,
    CreatePsiTestDto,
    UpdatePsiTestDto,
) {}
