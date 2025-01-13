import { CrudBaseService } from 'src/common/services/service';
import { Classification } from '../models/classification.entity';

export class ClassificationService extends CrudBaseService({
    model: Classification,
}) {}
