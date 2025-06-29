import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseEntity, Repository, SelectQueryBuilder } from 'typeorm';
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
        if (params.limit) {
            query = query.take(params.limit);
            if (params.offset) {
                query = query.skip(params.offset);
            }
        }
        if (params.ordered_by) query = this.orderedBy(params.ordered_by, query);

        return query;
    }

    private orderedBy(ordered_by, query: SelectQueryBuilder<any>) {
        const fields: Array<string> = [];
        let sortMethod: 'ASC' | 'DESC' = 'ASC';
        if (Array.isArray(ordered_by)) fields.push(...ordered_by);
        else {
            fields.push(...ordered_by.fields);
            sortMethod = ordered_by.sort_method || 'ASC';
        }

        query.orderBy(`${fields}`, sortMethod);
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

    public buildWhere(params, alias, oper = 'and') {
        let resultString = '';
        let resultParams = {};
        let recursiveCall = null;

        let param = '';
        for (const key in params) {
            if (key === 'or' || key === 'and') {
                recursiveCall = this.buildWhere(params[key], alias, key);
                resultString += `(${recursiveCall.resultString})`;
            } else {
                const regex =
                    /^(?:=|!=|<>|<|>|<=|>=|LIKE|like|IN|in)\s+(%[\S\s]*%)$/;

                if (resultString !== '') resultString += ` ${oper} `;

                if (Array.isArray(params[key]))
                    resultString += `${alias}.${key} in (${params[key]})`;
                else {
                    if (regex.test(params[key])) {
                        const expression = params[key].split(' ');
                        resultString += `${alias}.${key} ${expression[0]} :${key}`;
                        for (let i = 1; i < expression.length; i++) {
                            param +=
                                expression[i] +
                                (i + 1 == expression.length ? '' : ' ');
                        }
                    } else {
                        resultString += `${alias}.${key} = :${key}`;
                        param = params[key];
                    }
                }

                resultParams[key] = param;
                param = '';
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
        const repository: Repository<any> = model.getRepository();
        const element = await this.createObjectAndRelations(
            model,
            data,
            repository,
        );

        return element;
    }

    public async createObjectAndRelations(
        model,
        data,
        repository: Repository<any> | null = null,
    ) {
        if (!repository) repository = model.getRepository();
        const relations: RelationMetadata[] = repository.metadata.relations;

        const element = plainToInstance(model, data, {
            ignoreDecorators: true,
        });
        // const element = repository.create(data);

        const promises = [];
        for (const relation of relations) {
            if (relation.propertyName in data) {
                const relationType = relation.relationType;
                if (
                    relationType === 'one-to-one' ||
                    relationType === 'many-to-one'
                )
                    promises.push(
                        this.createSingleRelation(element, relation, data),
                    );
                else
                    promises.push(
                        this.createMultipleRelation(element, relation, data),
                    );
            }
        }

        await Promise.all(promises);

        return element;
    }
    private async createSingleRelation(element, relation, data) {
        element[relation.propertyName] = await this.createObjectAndRelations(
            relation.type,
            data[`${relation.propertyName}`],
        );
    }

    private async createMultipleRelation(element, relation, data) {
        const to_create = [];
        const to_select = [];
        const related = [];
        const promises = [];

        data[relation.propertyName].map((e) => {
            if (typeof e === 'object') to_create.push(e);
            else to_select.push(e);
        });

        if (to_create.length > 0)
            promises.push(
                this.createObjectAndRelations(relation.type, to_create),
            );

        if (to_select.length > 0)
            promises.push(
                this.collectionQuery(
                    { where: to_select },
                    relation.type,
                ).getMany(),
            );

        (await Promise.all(promises)).forEach((elements) =>
            related.push(...elements),
        );

        if (related.length > 0) element[relation.propertyName] = related;
    }
}
