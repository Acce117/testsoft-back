import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/services/service';
import { PsiTest } from '../models/psiTest.entity';

@Injectable()
export class PsiTestService extends AbstractService {
    protected model = PsiTest;
}
