import { Global, Module } from '@nestjs/common';
import { QueryFactory } from './services/query-factory';
import { FileHandlerService } from './services/file-handler.service';

@Module({
    providers: [QueryFactory, FileHandlerService],
    exports: [QueryFactory, FileHandlerService],
})
@Global()
export class CommonModule {}
