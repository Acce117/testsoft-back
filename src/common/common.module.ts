import { Global, Module } from '@nestjs/common';
import { QueryFactory } from './services/query-factory';
import { FSFileHandler } from './services/file-handler';
import { OnlyRedirectGuard } from './guards/onlyRedirect.guard';

@Module({
    providers: [QueryFactory, FSFileHandler, OnlyRedirectGuard],
    exports: [QueryFactory, FSFileHandler],
})
@Global()
export class CommonModule {}
