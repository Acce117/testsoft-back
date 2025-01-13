import { Inject, Injectable, Type } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { ICrudService } from './service.interface';
import { UpdateQueryBuilder } from 'typeorm';

interface ServiceOptions {
    model: any;
    delete?: 'soft' | 'hard';
}

async function hardDelete(id) {
    const alias = this.model.alias;
    return await this.model
        .createQueryBuilder(alias)
        .delete()
        .where(`${alias}.${this.model.primaryKey} = :id`, { id })
        .execute();
}

async function softDelete(id) {
    const alias = this.model.alias;
    return await this.model
        .createQueryBuilder(alias)
        .softDelete()
        .where(`${alias}.${this.model.primaryKey} = :id`, { id })
        .execute();
}

export function CrudBaseService(options: ServiceOptions): Type<ICrudService> {
    const closureDelete = options.delete === 'hard' ? hardDelete : softDelete;
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

        async delete(id: any) {
            return await closureDelete.bind(this).apply(null, [id]);
        }
    }

    return AbstractService;
}
