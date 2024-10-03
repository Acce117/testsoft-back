import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/services/service';
import { ApplicationAnswerValue } from '../models/applicationAnswerValue.entity';

@Injectable()
export class ApplicationAnswerValueService extends AbstractService {
    protected model: any = ApplicationAnswerValue;
}
