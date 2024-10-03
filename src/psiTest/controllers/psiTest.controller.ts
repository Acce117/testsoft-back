import { BaseController } from 'src/common/controllers/controller';
import { PsiTestService } from '../services/psiTest.service';
import { Controller, Inject } from '@nestjs/common';

@Controller('psi_test')
export class PsiTestController extends BaseController {
    @Inject(PsiTestService) service: PsiTestService;
}
