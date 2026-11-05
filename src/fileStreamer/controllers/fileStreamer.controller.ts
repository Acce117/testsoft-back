import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Query,
    StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join, resolve, sep } from 'path';

@Controller('file')
export class FileStreamerController {
    private readonly uploadsRoot = resolve(process.cwd(), 'uploads');

    @Get()
    getFile(@Query('path') path: string): StreamableFile {
        if (!path) throw new BadRequestException('path is required');

        const filePath = resolve(this.uploadsRoot, path);
        if (
            filePath !== this.uploadsRoot &&
            !filePath.startsWith(`${this.uploadsRoot}${sep}`)
        ) {
            throw new BadRequestException('invalid path');
        }

        if (!existsSync(filePath)) {
            throw new NotFoundException('file not found');
        }

        return new StreamableFile(createReadStream(filePath));
    }

    @Get('get-xlsx')
    async getCsv() {
        const file = createReadStream(
            join(process.cwd(), '/resources/template.xlsx'),
        );
        return new StreamableFile(file);
    }
}
