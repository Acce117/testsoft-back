import { CrudBaseController } from 'src/common/controllers/controller';
import { ClassificationService } from '../services/classification.service';

export class ClassificationController extends CrudBaseController(
    'classification',
    ClassificationService,
) {}
