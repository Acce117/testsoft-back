import { Inject } from '@nestjs/common';
import { QueryFactory } from './query-factory';
import { IService } from './service.interface';
export abstract class AbstractService implements IService {
    protected model = null;
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
        return this.model.createQueryBuilder().insert().values(data).execute();
    }
}
