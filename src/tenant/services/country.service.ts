import { CrudBaseService } from 'src/common/services/service';
import { Country } from '../models/country.entity';

export class CountryService extends CrudBaseService({ model: Country }) {}
