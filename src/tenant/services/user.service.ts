import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';
import { Inject } from '@nestjs/common';
import { GroupService } from './group.service';
import { paginateResult } from 'src/common/utils/paginateResult';
import { SelectedRoleService } from './selected_role.service';

export class UserService extends CrudBaseService({ model: User }) {
    @Inject(GroupService) private readonly groupService: GroupService;
    @Inject(SelectedRoleService)
    private readonly selectedRoleService: SelectedRoleService;

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
            result.push(...group.psiTests);
        }

        return paginateResult(params, result);
    }

    async selectedRoles(user_id: any, group: any) {
        const selectedRoles = await this.selectedRoleService.getAll({
            relations: ['role'],
            where: {
                fk_id_user: user_id,
                fk_id_group: group,
            },
        });

        const result = selectedRoles.map((sr) => {
            sr.fk_id_group == group;
            return { ...sr.role, preferred: sr.preferred };
        });

        return result;
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
