import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { Question } from './question.entity';
import { Inject } from '@nestjs/common';
import { FileHandler, FSFileHandler } from 'src/common/services/file-handler';
import { Image } from './image.entity';

@EventSubscriber()
export class QuestionSubscriber implements EntitySubscriberInterface<Question> {
    @Inject(FSFileHandler) fileHandler: FileHandler;

    constructor(private readonly dataSource: DataSource) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return Question;
    }

    afterInsert(event: InsertEvent<Question>): Promise<any> | void {
        const entity: Question = event.entity;
        if (entity.file) {
            const path = this.fileHandler.saveFile(entity.file);
            const image = new Image();
            image.url = path;
            image.question = entity;

            image.save();
        }
    }
}
