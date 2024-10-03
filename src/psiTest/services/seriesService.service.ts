import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/services/service';
import { TestSerie } from '../models/testSerie.entity';

@Injectable()
export class SeriesService extends AbstractService {
    protected model: any = TestSerie;
}
