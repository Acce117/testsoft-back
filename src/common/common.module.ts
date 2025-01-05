import { Global, Module } from '@nestjs/common';
import { QueryFactory } from './services/query-factory';
import { FSFileHandler } from './services/file-handler';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
    providers: [
        QueryFactory,
        FSFileHandler,
        { provide: AsyncLocalStorage, useValue: new AsyncLocalStorage() },
    ],
    exports: [QueryFactory, FSFileHandler, AsyncLocalStorage],
})
@Global()
export class CommonModule {}
