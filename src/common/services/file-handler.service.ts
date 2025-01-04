import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, rmSync } from 'fs';

@Injectable()
export class FileHandlerService {
    saveFileInFS(destination, file: Express.Multer.File) {
        const file_path = `${destination}${Date.now()}.${file.mimetype.split('/')[1]}`;
        try {
            const f = createWriteStream(file_path);
            f.write(file.buffer);
            f.end();
        } catch (err) {
            this.deleteFile(file_path);
        }
    }

    saveFileIn3rd(destination, file) {
        //TODO implement
    }

    private deleteFile(file_path: string) {
        const result = existsSync(file_path);
        if (result) {
            rmSync(file_path);
        }
        return result;
    }
}
