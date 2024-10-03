import { Global, Module } from '@nestjs/common';
import { QueryFactory } from './services/query-factory';

@Module({
    providers: [QueryFactory],
    exports: [QueryFactory],
})
@Global()
export class CommonModule {}
