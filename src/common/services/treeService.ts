import { InjectRepository } from '@nestjs/typeorm';
import { ICrudService } from './service.interface';
import { FindTreeOptions, TreeRepository } from 'typeorm';
import { Injectable, Type } from '@nestjs/common';
import { CrudBaseService } from './service';

export function TreeBaseService(model: any): Type<ICrudService> {
    @Injectable()
    class TreeService<T> extends CrudBaseService(model) {
        constructor(
            @InjectRepository(model)
            private readonly treeRepository: TreeRepository<T>,
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

        async getAll(params) {
            const options: FindTreeOptions = {};
            params.depth !== undefined
                ? (options.depth = params.depth)
                : params.depth;
            params.relations
                ? (options.relations = params.relations)
                : params.relations;
            return this.treeRepository.findTrees(options);
        }

        async create(data: any) {
            const father = await this.getOne({}, data.father_group);

            const group = this.model.create(data);
            group.parent = father;
            group.save();

            return group;
        }

        //TODO generalized, this is too specific
        async update(id: number, data: any) {
            if (data.father_group !== undefined) {
                const group = await this.getOne({}, id);
                const old_father = group.father_group;

                const new_father = data.father_group
                    ? await this.getOne({}, data.father_group)
                    : null;
                group.parent = new_father;
                group.mpath = this.resolvePath(
                    group.mpath,
                    new_father?.mpath,
                    old_father,
                );
                group.save();
            }

            const result = super.update(id, data);

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
