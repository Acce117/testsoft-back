import { CrudBaseService } from 'src/common/services/service';
import { ApplicationResult } from '../models/applicationResult.entity';

export class ApplicationResultService extends CrudBaseService(
    ApplicationResult,
) {}
