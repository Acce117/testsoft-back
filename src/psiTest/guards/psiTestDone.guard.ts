import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { PsiTest } from '../models/psiTest.entity';
import { PsiTestService } from '../services/psiTest.service';

export class PsiTestDoneGuard implements CanActivate {
    @Inject(PsiTestService) psiTestService: PsiTestService;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const psiTest: PsiTest = await this.psiTestService.getOne(
            request.params.id,
        );

        return psiTest.done;
    }
}
