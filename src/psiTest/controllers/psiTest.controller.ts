import { BaseController } from 'src/common/controllers/controller';
import { PsiTestService } from '../services/psiTest.service';
import { Controller } from '@nestjs/common';

@Controller('psiTest')
export class PsiTestController extends BaseController(PsiTestService) {}
