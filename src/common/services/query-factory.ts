import { Injectable } from '@nestjs/common';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

@Injectable()
export class QueryFactory {
    public structuralQuery(
        params,
        model,
        query?: SelectQueryBuilder<BaseEntity>,
    ) {
        if (!query) query = model.createQueryBuilder(model.alias);

        if (params.select) query = query.select(params.select);
        if (params.relations) query = this.setRelations(query, params, model);

        return query;
    }

    public collectionQuery(
        params,
        model,
        query?,
    ): SelectQueryBuilder<BaseEntity> {
        query = query ?? model.createQueryBuilder(model.alias);
        if (params.where) {
            if (Array.isArray(params.where))
                query.where(`${model.alias}.${model.primaryKey} IN (:...ids)`, {
                    ids: params.where,
                });
            else if (typeof params.where === 'object') {
                const { resultString, resultParams } = this.buildWhere(
                    params.where,
                    model.alias,
                );
                query = query.where(resultString, resultParams);
            }
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
        model: { alias: string } | string,
    ): SelectQueryBuilder<BaseEntity> {
        params.relations.forEach((relation) => {
            let alias =
                typeof model === 'string'
                    ? model
                    : (model.alias as unknown as { alias: string });

            if (typeof relation === 'string') {
                relation = relation.split('.');

                relation.forEach((rel) => {
                    query.leftJoinAndSelect(`${alias}.${rel}`, rel);
                    alias = rel;
                });
            } else if (typeof relation === 'object') {
                let resultString,
                    resultParams = null;

                if (relation.where) {
                    const where = this.buildWhere(
                        relation.where,
                        relation.name,
                    );
                    resultString = where.resultString;
                    resultParams = where.resultParams;
                }

                query.leftJoinAndSelect(
                    `${alias}.${relation.name || relation[`[name]`]}`,
                    relation.name || relation['[name]'],
                    resultString,
                    resultParams,
                );

                if (relation.relations)
                    query = this.setRelations(query, relation, relation.name);
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

    //TODO working on it
    /**Some relations types still in progress */
    public async createQuery(data, model) {
        const repository = model.getRepository();
        const relations: RelationMetadata[] =
            model.getRepository().metadata.relations;

        const element = repository.create(data);

        for (const relation of relations) {
            if (relation.propertyName in data) {
                const relationType = relation.relationType;
                if (
                    relationType === 'one-to-one' ||
                    relationType === 'many-to-one'
                )
                    element[relation.propertyName] = await this.createQuery(
                        data[`${relation.propertyName}`],
                        relation.type,
                    );
                else {
                    if (Array.isArray(data[relation.propertyName])) {
                        const elements = await this.collectionQuery(
                            {
                                where: data[relation.propertyName],
                            },
                            relation.type,
                        ).getMany();

                        element[relation.propertyName] = elements;
                    }
                }
            }
        }

        await repository.save(element);
        return element;
    }
}
