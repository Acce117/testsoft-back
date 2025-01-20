import { Module } from '@nestjs/common';
import { FileStreamerController } from './controllers/fileStreamer.controller';

@Module({
    controllers: [FileStreamerController],
    providers: [],
    imports: [],
    exports: [],
})
export class FileStreamerModule {}
