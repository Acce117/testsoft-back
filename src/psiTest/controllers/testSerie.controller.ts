import { CrudBaseController } from 'src/common/controllers/controller';
import { TestSerieService } from '../services/testSerie.service';

export class TestSerieController extends CrudBaseController({
    prefix: 'test_serie',
    service: TestSerieService,
}) {}
