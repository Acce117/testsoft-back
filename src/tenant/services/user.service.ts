import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';
import { Inject } from '@nestjs/common';
import { GroupService } from './group.service';
import { paginateResult } from 'src/common/utils/paginateResult';

export class UserService extends CrudBaseService({ model: User }) {
    @Inject(GroupService) private readonly groupService: GroupService;

    public async userTests(user_id: number, group_id, params) {
        const result = [];

        const user: User = await this.getOne(
            {
                relations: [
                    {
                        name: 'groups',
                        relations: [
                            {
                                name: 'psiTests',
                                relations: [
                                    {
                                        name: 'test_apps',
                                        where: {
                                            fk_id_user: user_id,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            user_id,
        );

        if (user?.groups) {
            const group = user.groups.find(
                (group) => group.id_group == group_id,
            );
            result.push(group.psiTests);
        }

        return paginateResult(params, result);
    }

    async selectedRoles(user_id: any, group: any) {
        const user: User = await this.getOne(
            {
                relations: ['selected_role'],
            },
            user_id,
        );

        const selected_roles = user.selected_role.filter(
            (role) => role.fk_id_group == group,
        );

        return selected_roles;
    }

    public async createMyGroup(group, id_user: number) {
        const newGroup = await this.groupService.create(group);

        const user: User = await this.getOne({}, id_user);
        user.enabled = true;
        user.my_groups.push(newGroup);

        await user.save();

        return {
            newGroup,
        };
    }
}
