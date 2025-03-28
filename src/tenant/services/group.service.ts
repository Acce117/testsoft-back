import { Group } from '../models/group.entity';
import { TreeBaseService } from 'src/common/services/treeService';
import { User } from '../models/user.entity';

export class GroupService extends TreeBaseService({ model: Group }) {
    //add filter
    public async getUsers(params, id) {
        const group = await this.getOne({ depth: 0 }, id);

        const data = await this.treeRepository
            .createDescendantsQueryBuilder(
                this.model.alias,
                this.model.alias + 'Clousure',
                group,
            )
            .leftJoinAndSelect(`${this.model.alias}.users`, User.alias)
            .leftJoinAndSelect(`${User.alias}.groups`, 'user_groups')
            .getMany();

        const users = [];
        data.forEach((group) => users.push(...group.users));

        let limit = params.limit || 10;
        const offset = params.offset || 0;

        if (offset + limit > users.length - 1)
            limit = (users.length % limit) - 1;

        return users.slice(offset, offset + limit);
    }
}
