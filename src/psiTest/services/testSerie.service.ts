import { CrudBaseService } from 'src/common/services/service';
import { TestSerie } from '../models/testSerie.entity';

export class TestSerieService extends CrudBaseService({
    model: TestSerie,
    delete: 'hard',
}) {}
