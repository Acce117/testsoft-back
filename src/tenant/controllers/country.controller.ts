import { CrudBaseController } from 'src/common/controllers/controller';
import { CountryService } from '../services/country.service';

export class CountryController extends CrudBaseController(
    'country',
    CountryService,
) {}
