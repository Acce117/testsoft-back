import { Group } from '../models/group.entity';
import { TreeBaseService } from 'src/common/services/treeService';
import { User } from '../models/user.entity';
import { Compatibility } from '../models/compatibility.entity';
import { paginateResult } from 'src/common/utils/paginateResult';
import { QueryFactory } from 'src/common/services/query-factory';
import { Inject } from '@nestjs/common';

export class GroupService extends TreeBaseService({ model: Group }) {
    @Inject(QueryFactory) queryFactory: QueryFactory;

    private async getUsers(params, id) {
        const group = await this.getOne({ depth: 0 }, id);
        const { resultString, resultParams } = this.queryFactory.buildWhere(
            params.where,
            User.alias,
        );
        let query = this.treeRepository
            .createDescendantsQueryBuilder(
                this.model.alias,
                this.model.alias + 'Clousure',
                group,
            )
            .leftJoinAndSelect(
                `${this.model.alias}.users`,
                User.alias,
                resultString,
                resultParams,
            )
            .leftJoinAndSelect(`${User.alias}.groups`, 'user_groups');
        if (params.groups)
            query = query.where(`group.id_group in (${params.groups})`);

        return query;
    }

    public async getUsersFromGroup(params, id) {
        const query = await this.getUsers(params, id);

        const data = await query.getOne();
        const users = data.users;

        return paginateResult(params, users);
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

        return paginateResult(params, data.users);
    }

    public async getUsersFromTree(params, id) {
        const data = await (await this.getUsers(params, id)).getMany();

        const users = [];
        data.forEach((group) => users.push(...group.users));

        return paginateResult(params, users);
    }
}
