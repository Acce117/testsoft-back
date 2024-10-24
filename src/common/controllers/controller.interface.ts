import { DataSource } from 'typeorm';

export interface IController {
    service: object;
    dataSource?: DataSource;
}
