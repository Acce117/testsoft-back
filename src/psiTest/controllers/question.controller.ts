import { CrudBaseController } from 'src/common/controllers/controller';
import { QuestionService } from '../services/question.service';
import { FileInBody } from 'src/common/decorators/fileInBody.decorator';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class QuestionController extends CrudBaseController({
    prefix: 'question',
    service: QuestionService,
    decorators: [UseGuards(RoleGuard), Roles(['Analyst'])],
    create: {
        decorators: [FileInBody('file')],
    },
    update: {
        decorators: [FileInBody('file')],
    },
}) {}
