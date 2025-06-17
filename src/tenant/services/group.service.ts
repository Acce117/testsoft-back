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

    public async getUsersFromTree(params) {
        const query = User.getRepository()
            .createQueryBuilder('user')
            .select([
                'user.user_id',
                'user.CI',
                'user.name',
                'user.last_name',
                // 'user.username',
                'user.email',
                'user.sex',
                'user.deleted',
                'user.country_id',
                'user.enabled',
                'user.deleted_at',
                'country.name',
                `JSON_ARRAYAGG(JSON_OBJECT('id', group_id, 'nombre', name_group, 'role', auth_item.name)) AS assignments`,
            ])
            .innerJoin('user.assignments', 'assignment')
            .innerJoin('assignment.groups', 'group')
            .innerJoin('assignment.role', 'auth_item')
            .innerJoin('user.country', 'country')
            .where('group.id_group IN (:...ids)', { ids: params.groups })
            .groupBy('user.email, user.name, user.last_name, user.CI');

        if (params.where) {
            const { resultParams, resultString } = this.queryFactory.buildWhere(
                params.where,
                User.alias,
            );
            query.andWhere(resultString, resultParams);
        }
        const result = await query.getRawMany();

        const data = paginateResult(params, result);

        data.data = data.data.map((element) => ({
            user_id: element.user_user_id,
            CI: element.user_CI,
            name: element.user_name,
            last_name: element.user_last_name,
            // username: element.user_username,
            email: element.user_email,
            sex: element.user_sex,
            deleted: element.user_deleted,
            enabled: element.user_enabled,
            deleted_at: element.user_deleted_at,
            country_id: element.user_country_id,
            assignments: JSON.parse(element.assignments),
            country: element.country_name,
        }));

        return data;
    }
}
