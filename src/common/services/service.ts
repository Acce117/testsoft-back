import { Inject, Injectable, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { EntityManager } from 'typeorm';
import { DATA_LIMIT } from '../utils/constants';

export interface ServiceOptions {
    model: any;
    delete?: 'soft' | 'hard';
}

export function CrudBaseService(options: ServiceOptions): Type<ICrudService> {
    @Injectable()
    class AbstractService implements ICrudService {
        model = options.model;
        @Inject(QueryFactory) readonly queryFactory: QueryFactory;

        getAll(params): Promise<any> {
            params.limit = params.limit ? params.limit : DATA_LIMIT;
            return this.queryFactory.selectQuery(params, this.model).getMany();
        }

        getOne(params, id?): Promise<any> {
            let query = this.queryFactory.structuralQuery(params, this.model);

            if (id)
                query = query.where(
                    `${this.model.alias}.${this.model.primaryKey} = :id`,
                    { id },
                );
            else if (params.where) {
                query.where(params.where);
            }

            return query.getOne();
        }

        create(data, manager?: EntityManager): Promise<any> {
            return this.queryFactory.createQuery(data, this.model, manager);
        }

        update(id: any, data: any, manager?: EntityManager) {
            const query = manager
                .withRepository(this.model.getRepository())
                .createQueryBuilder()
                .update()
                .set(data)
                .where(`${this.model.primaryKey} = :id`, { id });

            return query.execute();
        }

        async delete(id: any, manager?: EntityManager): Promise<any> {
            const alias = this.model.alias;
            let query = manager
                .withRepository(this.model.getRepository())
                .createQueryBuilder(alias);

            options.delete === 'hard'
                ? (query = query.delete())
                : (query = query.softDelete());

            query = query.where(`${alias}.${this.model.primaryKey} = :id`, {
                id,
            });

            return query.execute();
        }

        async getPaginationData(limit = DATA_LIMIT) {
            const elements_amount = await this.model
                .createQueryBuilder()
                .getCount();

            return {
                pages: Math.ceil(elements_amount / limit),
                elements_amount,
                data: null,
            };
        }
    }

    return AbstractService;
}
