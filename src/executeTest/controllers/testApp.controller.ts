import { CrudBaseController } from 'src/common/controllers/controller';
import { TestApplicationService } from '../services/testApplication.service';

export class TestApplicationController extends CrudBaseController(
    'test_app',
    TestApplicationService,
) {}
