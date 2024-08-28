import { Injectable } from '@nestjs/common';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryFactory {
    public structuralQuery(params, model, query?) {
        if (!query) query = model.createQueryBuilder();

        if (params.select) query = query.select(params.select);
        if (params.relations) query = this.setRelations(query, params, model);

        return query;
    }

    public collectionQuery(params, model, query?) {
        if (params.where) {
            const { resultString, resultParams } = this.buildWhere(
                params.where,
                model.alias,
            );
            query.where(resultString, resultParams);
        }

        return query;
    }

    public selectQuery(params, model): SelectQueryBuilder<BaseEntity> {
        let query = model.createQueryBuilder(model.alias);

        query = this.structuralQuery(params, model, query);

        query = this.collectionQuery(params, model, query);

        return query;
    }

    private setRelations(
        query: SelectQueryBuilder<BaseEntity>,
        params,
        model,
    ): SelectQueryBuilder<BaseEntity> {
        params.relations.forEach((relation) => {
            if (typeof relation === 'string') {
                relation = relation.split('.');
                let alias = `${model.alias}`;

                relation.forEach((rel) => {
                    query.leftJoinAndSelect(`${alias}.${rel}`, rel);
                    alias = rel;
                });
            } else {
                const { resultString, resultParams } = this.buildWhere(
                    relation.where,
                    relation.name,
                );

                query.leftJoinAndSelect(
                    `${model.alias}.${relation.name}`,
                    relation.name,
                    resultString,
                    resultParams,
                );
            }
        });

        return query;
    }

    private buildWhere(params, alias, oper = 'and') {
        let resultString = '';
        let resultParams = {};
        let recursiveCall = null;

        for (const key in params) {
            if (key === 'or' || key === 'and') {
                recursiveCall = this.buildWhere(params[key], alias, key);
                resultString += `(${recursiveCall.resultString})`;
            } else {
                //TODO handle another operator than equals
                //TODO handle NOT operator
                if (resultString !== '') resultString += ` ${oper} `;

                resultString += `${alias}.${key} = :${key}`;

                resultParams[key] = params[key];
            }
        }

        resultParams = {
            ...resultParams,
            ...recursiveCall?.resultParams,
        };

        return {
            resultString,
            resultParams,
        };
    }
}
