import { CrudBaseController } from 'src/common/controllers/controller';
import { CorrectAnswerService } from '../services/correctAnswer.service';
import { UseGuards } from '@nestjs/common';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';

export class CorrectAnswerController extends CrudBaseController({
    prefix: 'correct_answer',
    service: CorrectAnswerService,
    decorators: [UseGuards(RoleGuard), Roles(['Analyst'])],
}) {}
