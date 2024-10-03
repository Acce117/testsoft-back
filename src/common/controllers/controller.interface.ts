import { DataSource } from 'typeorm';
import { IService } from '../services/service.interface';

export interface IController {
    service: IService;
    dataSource?: DataSource;
}
