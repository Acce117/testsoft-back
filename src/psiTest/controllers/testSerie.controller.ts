import { CrudBaseController } from 'src/common/controllers/controller';
import { TestSerieService } from '../services/testSerie.service';

export class TestSerieController extends CrudBaseController(
    'test_serie',
    TestSerieService,
) {}
