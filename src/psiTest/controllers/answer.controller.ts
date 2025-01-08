import { CrudBaseController } from 'src/common/controllers/controller';
import { AnswerService } from '../services/answer.service';
import { FileInBody } from 'src/common/decorators/fileInBody.decorator';

export class AnswerController extends CrudBaseController({
    prefix: 'answer',
    service: AnswerService,
    create: {
        decorators: [FileInBody('file')],
    },
}) {}
