import { CrudBaseService } from 'src/common/services/service';
import { Group } from '../models/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';

export class GroupService extends CrudBaseService(Group) {
    constructor(@InjectRepository(Group) readonly repo: TreeRepository<Group>) {
        // repo.metadata.columns = repo.metadata.columns.map((x) => {
        //     if (x.databaseName === 'mpath') {
        //         x.isVirtual = false;
        //     }
        //     return x;
        // });

        super();
    }

    async create(data: any) {
        const father = await this.getOne({}, data.father_group);

        const group = Group.create(data);
        group.parent = father;
        group.save();

        return group;
    }

    async getAll() {
        return this.repo.findTrees();
    }
}
