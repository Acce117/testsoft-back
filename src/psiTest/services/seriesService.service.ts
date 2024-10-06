import { Injectable } from '@nestjs/common';
import { CrudBaseService } from 'src/common/services/service';
import { TestSerie } from '../models/testSerie.entity';

@Injectable()
export class SeriesService extends CrudBaseService(TestSerie) {}
