import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { Answer } from './answer.entity';
import { FileHandler, FSFileHandler } from 'src/common/services/file-handler';
import { Image } from './image.entity';
import { Inject } from '@nestjs/common';

@EventSubscriber()
export class AnswerSubscriber implements EntitySubscriberInterface {
    @Inject(FSFileHandler) fileHandler: FileHandler;

    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Answer;
    }

    afterInsert(event: InsertEvent<Answer>): Promise<any> | void {
        const entity: Answer = event.entity;

        if (entity.file) {
            const path = this.fileHandler.saveFile(entity.file);
            const image = new Image();
            image.url = path;
            image.answer = entity;

            image.save();
        }
    }

    afterUpdate(event: UpdateEvent<Answer>): Promise<any> | void {
        const entity: Answer = event.entity as Answer;

        if (entity.file) {
            const path = this.fileHandler.saveFile(entity.file);
            const image = new Image();
            image.url = path;
            image.answer = entity;

            image.save();
        }
    }
}
