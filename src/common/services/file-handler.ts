import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, rmSync } from 'fs';

export interface FileHandler {
    saveFile(destination: string, file: Express.Multer.File): string;
}

@Injectable()
export class FSFileHandler implements FileHandler {
    saveFile(destination: any, file: any): string {
        const file_path = `${destination}${Date.now()}.${file.mimetype.split('/')[1]}`;
        try {
            const f = createWriteStream(file_path);
            f.write(file.buffer);
            f.end();
        } catch (err) {
            this.deleteFile(file_path);
        }

        return file_path;
    }

    private deleteFile(file_path: string) {
        const result = existsSync(file_path);
        if (result) {
            rmSync(file_path);
        }
        return result;
    }
}

@Injectable()
export class ExternalFileHandler implements FileHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveFile(destination: string, file: Express.Multer.File): string {
        throw new Error('Method not implemented.');
    }
}
