import { Inject, Injectable, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { EntityManager } from 'typeorm';

export interface ServiceOptions {
    model: any;
    delete?: 'soft' | 'hard';
}

export function CrudBaseService(options: ServiceOptions): Type<ICrudService> {
    @Injectable()
    class AbstractService implements ICrudService {
        model = options.model;
        @Inject(QueryFactory) readonly queryFactory: QueryFactory;

        getAll(params) {
            return this.queryFactory.selectQuery(params, this.model).getMany();
        }

        getOne(params, id?) {
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

        create(data, manager?: EntityManager) {
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

        async delete(id: any, manager?: EntityManager) {
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
    }

    return AbstractService;
}
