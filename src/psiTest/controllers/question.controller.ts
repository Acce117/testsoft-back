import { CrudBaseController } from 'src/common/controllers/controller';
import { QuestionService } from '../services/question.service';
import { FileInBody } from 'src/common/decorators/fileInBody.decorator';

export class QuestionController extends CrudBaseController({
    prefix: 'question',
    service: QuestionService,
    create: {
        decorators: [FileInBody('file')],
    },
}) {}
