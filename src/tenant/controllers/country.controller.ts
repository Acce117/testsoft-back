import { CrudBaseController } from 'src/common/controllers/controller';
import { CountryService } from '../services/country.service';

export class CountryController extends CrudBaseController({
    prefix: 'country',
    service: CountryService,
}) {}
