import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, FindTreeOptions, TreeRepository } from 'typeorm';
import { Inject, Injectable, Type } from '@nestjs/common';
import { CrudBaseService, ServiceOptions } from './service';
import { ICrudTreeService } from './service.interface';
import { QueryFactory } from './query-factory';

export function TreeBaseService<T extends { children }>(
    options: ServiceOptions,
): Type<ICrudTreeService> {
    @Injectable()
    class TreeService extends CrudBaseService(options) {
        @Inject(QueryFactory) queryFactory: QueryFactory;

        constructor(
            @InjectRepository(options.model)
            public readonly treeRepository: TreeRepository<T>,
        ) {
            super();
            this.treeRepository.metadata.columns =
                this.treeRepository.metadata.columns.map((x) => {
                    if (x.databaseName === 'mpath') {
                        x.isVirtual = false;
                    }
                    return x;
                });
        }

        private parseParams(params) {
            const options: FindTreeOptions = {};
            params.depth !== undefined
                ? (options.depth = params.depth)
                : params.depth;
            params.relations
                ? (options.relations = params.relations)
                : params.relations;

            return options;
        }

        async getAll(params) {
            return this.treeRepository.findTrees(this.parseParams(params));
        }

        async getOne(params: any, id?: any) {
            const options = this.parseParams(params);
            const element = await super.getOne(
                {
                    relations: options.relations,
                },
                id,
            );
            const result: T = await this.treeRepository.findDescendantsTree(
                element,
                options,
            );

            return result;
        }

        async getAncestors(params: object, id?: any) {
            const element = await super.getOne(params, id);
            return await this.treeRepository.findAncestors(
                element,
                this.parseParams(params),
            );
        }

        async getDescendants(params: object, id?: any) {
            const element = await super.getOne(params, id);
            return await this.treeRepository.findDescendants(
                element,
                this.parseParams(params),
            );
        }

        async create(data: any, manager: EntityManager) {
            const group: any = await this.queryFactory.createQuery(
                data,
                this.model,
            );

            if (data.father_group) {
                const father = await this.getOne({}, data.father_group);
                group.parent = father;
            }

            await manager.withRepository(this.treeRepository).save(group);
            return group;
        }

        //TODO generalized, this is too specific
        async update(id: number, data: any, manager: EntityManager) {
            if (data.father_group !== undefined) {
                const group = await super.getOne({}, id);
                const old_father = group.father_group;

                const new_father = data.father_group
                    ? await super.getOne({}, data.father_group)
                    : null;
                group.parent = new_father;
                group.mpath = this.resolvePath(
                    group.mpath,
                    new_father?.mpath,
                    old_father,
                );
                group.save();
            }

            const result = super.update(id, data, manager);

            return result;
        }

        private resolvePath(
            child_path: string,
            father_path: string,
            old_father_id: any,
        ) {
            let new_path = father_path || '';
            if (old_father_id) {
                const paths_array = child_path.split(`${old_father_id}.`);

                switch (paths_array.length) {
                    case 1:
                        new_path += paths_array[0];
                        break;
                    case 2:
                        new_path += paths_array[1];
                }
            } else {
                new_path += child_path;
            }
            return new_path;
        }
    }

    return TreeService;
}
