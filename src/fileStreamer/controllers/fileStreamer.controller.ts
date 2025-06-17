import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileStreamerController {
    @Get()
    getFile(@Query('path') path: string): StreamableFile {
        const file = createReadStream(join(process.cwd(), `/uploads/${path}`));
        return new StreamableFile(file);
    }

    @Get('get-xlsx')
    async getCsv() {
        const file = createReadStream(
            join(process.cwd(), '/resources/template.xlsx'),
        );
        return new StreamableFile(file);
    }
}
