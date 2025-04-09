import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';
import { Inject } from '@nestjs/common';
import { GroupService } from './group.service';
import { paginateResult } from 'src/common/utils/paginateResult';

export class UserService extends CrudBaseService({ model: User }) {
    @Inject(GroupService) private readonly groupService: GroupService;

    public async userTests(user_id: number, params) {
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

        if (user?.groups)
            user.groups.forEach((group) => result.push(...group.psiTests));

        return paginateResult(params, result);
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
