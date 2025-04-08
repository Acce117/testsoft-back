import { Group } from '../models/group.entity';
import { TreeBaseService } from 'src/common/services/treeService';
import { User } from '../models/user.entity';
import { Compatibility } from '../models/compatibility.entity';

export class GroupService extends TreeBaseService({ model: Group }) {
    //add filter
    public async getUsers(params, id) {
        const group = await this.getOne({ depth: 0 }, id);

        return this.treeRepository
            .createDescendantsQueryBuilder(
                this.model.alias,
                this.model.alias + 'Clousure',
                group,
            )
            .leftJoinAndSelect(`${this.model.alias}.users`, User.alias)
            .leftJoinAndSelect(`${User.alias}.groups`, 'user_groups');
    }

    public async getUsersFromGroup(params, id) {
        const query = await this.getUsers(params, id);

        const data = await query.getOne();
        const users = data.users;

        let limit = parseInt(params.limit) || users.length;
        const offset = parseInt(params.offset) || 0;

        if (offset + limit > users.length) limit = users.length % limit;

        return {
            pages: Math.ceil(users.length / limit),
            elements_amount: users.length,
            data: users.slice(offset, offset + limit),
        };
    }

    public async getUsersWithLeadershipAndIncompatibilities(params, id) {
        const query = await this.getUsers(params, id);

        const data = await query
            .leftJoinAndSelect(`${User.alias}.leadership`, 'leadership')
            .leftJoinAndSelect(
                `${User.alias}.compatibility`,
                Compatibility.alias,
            )
            .leftJoinAndSelect(
                `${Compatibility.alias}.destination_users`,
                'destination_users',
            )
            .getOne();

        const users = data.users;

        let limit = parseInt(params.limit) || users.length;
        const offset = parseInt(params.offset) || 0;

        if (offset + limit > users.length) limit = users.length % limit;

        return {
            pages: Math.ceil(users.length / limit),
            elements_amount: users.length,
            data: users.slice(offset, offset + limit),
        };
    }

    public async getUsersFromTree(params, id) {
        const data = await (await this.getUsers(params, id)).getMany();

        const users = [];
        data.forEach((group) => users.push(...group.users));

        let limit = parseInt(params.limit) || users.length;
        const offset = parseInt(params.offset) || 0;

        if (offset + limit > users.length) limit = users.length % limit;

        return {
            pages: Math.ceil(users.length / limit),
            elements_amount: users.length,
            data: users.slice(offset, offset + limit),
        };
    }
}
