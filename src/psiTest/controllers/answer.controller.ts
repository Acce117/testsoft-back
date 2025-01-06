import { CrudBaseController } from 'src/common/controllers/controller';
import { AnswerService } from '../services/answer.service';
import { Body, Post } from '@nestjs/common';
import { FileInBody } from 'src/common/decorators/fileInBody.decorator';

export class AnswerController extends CrudBaseController({
    prefix: 'answer',
    service: AnswerService,
}) {
    @Post()
    @FileInBody('file')
    create(@Body() body: any) {
        super.create(body);
    }
}
