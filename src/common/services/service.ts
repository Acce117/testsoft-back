import { Inject, Injectable, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { UpdateQueryBuilder } from 'typeorm';

export function CrudBaseService(model: any): Type<ICrudService> {
    @Injectable()
    class AbstractService implements ICrudService {
        model = model;
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

        create(data) {
            return this.queryFactory.createQuery(data, this.model);
        }

        update(id: any, data: any) {
            const query: UpdateQueryBuilder<typeof this.model> = this.model
                .createQueryBuilder()
                .update()
                .set(data)
                .where(`${this.model.primaryKey} = :id`, { id });

            return query.execute();
        }
    }

    return AbstractService;
}
