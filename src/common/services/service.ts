import { Inject, Injectable, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { instanceToPlain } from 'class-transformer';

export function CrudBaseService(model: any): Type<ICrudService> {
    @Injectable()
    class AbstractService implements ICrudService {
        protected model = model;
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

        //TODO still workin on it
        /**
         * It doew not work with table inheritance and related data
         */
        create(data) {
            const model = this.model
                .createQueryBuilder()
                .insert()
                .values(data)
                .execute();

            return instanceToPlain(model);
        }
    }

    return AbstractService;
}
