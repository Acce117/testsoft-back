import { Injectable } from '@nestjs/common';
import { ApplicationAnswer } from '../models/applicationAnswer.entity';
import { AbstractService } from 'src/common/services/service';

@Injectable()
export class ApplicationAnswerService extends AbstractService {
    protected model: any = ApplicationAnswer;
}
