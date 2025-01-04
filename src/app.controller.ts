import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryFactory } from './common/services/query-factory';
import { PsiTest } from './psiTest/models/psiTest.entity';

@Controller()
export class AppController {
    @Inject(QueryFactory) queryFactory: QueryFactory;
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello() {
        // this.queryFactory.getRelations(PsiTest);
        const result = PsiTest.getRepository().metadata.columns;
        return result;
        // return this.appService.getHello();
    }
}
