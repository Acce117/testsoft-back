import { CrudBaseService } from 'src/common/services/service';
import { TestApplication } from '../models/testApplication.entity';

export class TestApplicationService extends CrudBaseService(TestApplication) {}
