import { Injectable } from '@nestjs/common';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
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

    public collectionQuery(params, model, query?) {
        if (params.where) {
            const { resultString, resultParams } = this.buildWhere(
                params.where,
                model.alias,
            );
            query = query.where(resultString, resultParams);
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

    public async createQuery(data, model) {
        const columns: ColumnMetadata[] =
            model.getRepository().metadata.columns;

        const relations: RelationMetadata[] =
            model.getRepository().metadata.relations;

        const element = new model();

        for (const column of columns) {
            if (column.propertyName in data)
                element[column.propertyName] = data[column.propertyName];
        }

        for (const relation of relations) {
            if (relation.propertyName in data) {
                const relatedElement = await this.createQuery(
                    data[`${relation.propertyName}`],
                    relation.type,
                );
                element[relation.propertyName] = relatedElement;
            }
        }

        await element.save();
        return element;
    }
}
