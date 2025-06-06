import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, rmSync, WriteStream } from 'fs';

export interface FileHandler {
    readonly base_path: string;
    saveFile(file: Express.Multer.File, destination?: string);
}

@Injectable()
export class FSFileHandler implements FileHandler {
    readonly base_path: string = './uploads/';

    saveFile(
        file: Express.Multer.File,
        destination?: string,
    ): { file_name: string; stream: WriteStream } {
        let file_path = `${this.base_path}`;
        const file_name = `${Date.now()}.${file.mimetype.split('/')[1]}`;
        destination
            ? (file_path += `${destination}/${file_name}`)
            : (file_path += `${file_name}`);

        let stream = null;
        try {
            const f = createWriteStream(file_path);
            f.write(file.buffer);

            stream = f.end();
        } catch (err) {
            this.deleteFile(file_path);
        }

        return { file_name, stream };
    }

    public deleteFile(file_path: string) {
        const result = existsSync(file_path);
        if (result) {
            rmSync(file_path);
        }
        return result;
    }
}

@Injectable()
export class ExternalFileHandler implements FileHandler {
    readonly base_path: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveFile(file: Express.Multer.File, destination?: string) {
        throw new Error('Method not implemented.');
    }
}
