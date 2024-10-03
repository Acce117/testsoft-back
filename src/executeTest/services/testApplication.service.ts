import { AbstractService } from 'src/common/services/service';
import { TestApplication } from '../models/testApplication.entity';

export class TestApplicationService extends AbstractService {
    protected model: any = TestApplication;
}
