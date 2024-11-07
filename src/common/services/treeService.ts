import { InjectRepository } from '@nestjs/typeorm';
import { ICrudService } from './service.interface';
import { TreeRepository } from 'typeorm';
import { Injectable, Type } from '@nestjs/common';
import { CrudBaseService } from './service';

export function TreeBaseService(model: any): Type<ICrudService> {
    @Injectable()
    class TreeService<T> extends CrudBaseService(model) {
        @InjectRepository(model) treeRepository: TreeRepository<T>;

        async create(data: any) {
            const father = await this.getOne({}, data.father_group);

            const group = this.model.create(data);
            group.parent = father;
            group.save();

            return group;
        }

        async getAll() {
            return this.treeRepository.findTrees();
        }
    }

    return TreeService;
}
