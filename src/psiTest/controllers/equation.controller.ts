import { CrudBaseController } from 'src/common/controllers/controller';
import { EquationService } from '../services/equation.service';

export class EquationController extends CrudBaseController({
    prefix: 'equation',
    service: EquationService,
}) {}
