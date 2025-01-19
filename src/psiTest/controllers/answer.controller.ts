import { CrudBaseController } from 'src/common/controllers/controller';
import { AnswerService } from '../services/answer.service';
import { FileInBody } from 'src/common/decorators/fileInBody.decorator';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class AnswerController extends CrudBaseController({
    prefix: 'answer',
    service: AnswerService,
    create: {
        decorators: [FileInBody('file')],
    },
    decorators: [UseGuards(RoleGuard), Roles(['Analyst'])],
}) {}
