import { Inject, Injectable, NotFoundException, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { DATA_LIMIT } from '../utils/constants';

export interface ServiceOptions {
    model: any;
    delete?: 'soft' | 'hard';
}

export function CrudBaseService(options: ServiceOptions): Type<ICrudService> {
    @Injectable()
    class AbstractService implements ICrudService {
        model = options.model;
        @Inject(QueryFactory) queryFactory: QueryFactory;

        getAll(params): Promise<any> {
            // params.limit = params.limit ? params.limit : DATA_LIMIT;
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

        async create(data, manager?: EntityManager): Promise<any> {
            const element = await this.queryFactory.createQuery(
                data,
                this.model,
            );

            let result = null;

            const repository = this.model.getRepository();

            if (manager) {
                if (Array.isArray(element))
                    result = manager
                        .withRepository(repository)
                        .save(element.map((e) => repository.create(e)));
                else result = manager.withRepository(repository).save(element);
            } else result = repository.save(element);

            return result;
        }

        async update(id: any, data: any, manager?: EntityManager) {
            const existingEntity = await manager.findOne(this.model, {
                where: { [this.model.primaryKey]: id },
            });

            if (!existingEntity) {
                throw new NotFoundException('Entidad no encontrada');
            }

            Object.keys(data).forEach((key) => {
                existingEntity[key] = data[key];
            });

            return manager.save(existingEntity);
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

        async getPaginationData(limit = DATA_LIMIT, offset = 1, where?) {
            const query: SelectQueryBuilder<any> =
                this.model.createQueryBuilder(this.model.alias);

            if (where) {
                const { resultString, resultParams } =
                    this.queryFactory.buildWhere(where, this.model.alias);

                query.where(resultString, resultParams);
            }

            const elements_amount = await query.getCount();

            const pages = Math.ceil(elements_amount / limit);
            return {
                pages,
                actual_page: Math.ceil(offset / limit),
                elements_amount,
                data: null,
            };
        }
    }

    return AbstractService;
}
