import { BaseEntity } from 'typeorm';

export abstract class BaseModel extends BaseEntity {
    static readonly alias: string;
    static readonly primaryKey: string;
}
