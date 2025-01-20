import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
// import { join } from 'path';

@Controller('file')
export class FileStreamerController {
    @Get()
    getFile(@Query('path') path: string): StreamableFile {
        const file = createReadStream(join(process.cwd(), path));
        return new StreamableFile(file);
    }
}
