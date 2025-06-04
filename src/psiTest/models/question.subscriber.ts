import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { Question } from './question.entity';
import { Inject } from '@nestjs/common';
import { FileHandler, FSFileHandler } from 'src/common/services/file-handler';

@EventSubscriber()
export class QuestionSubscriber implements EntitySubscriberInterface<Question> {
    @Inject(FSFileHandler) fileHandler: FileHandler;

    constructor(private readonly dataSource: DataSource) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return Question;
    }

    saveFile(entity: any) {
        if (entity.file) {
            const path = this.fileHandler.saveFile(entity.file);
            entity.image_url = path;
            entity.save({ listeners: false });
        }
    }

    afterInsert(event: InsertEvent<Question>): Promise<any> | void {
        this.saveFile(event.entity);
    }

    afterUpdate(event: UpdateEvent<Question>): Promise<any> | void {
        this.saveFile(event.entity);
    }
}
