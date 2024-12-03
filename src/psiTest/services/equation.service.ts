import { CrudBaseService } from 'src/common/services/service';
import { Equation } from '../models/equation.entity';

export class EquationService extends CrudBaseService(Equation) {}
