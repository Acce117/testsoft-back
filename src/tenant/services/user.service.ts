import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';
import { Inject } from '@nestjs/common';
import { GroupService } from './group.service';

export class UserService extends CrudBaseService(User) {
    @Inject(GroupService) private readonly groupService: GroupService;
    public async userTests(user_id: number) {
        const result = [];

        const user: User = await this.getOne(
            {
                relations: [
                    {
                        name: 'groups',
                        relations: [{ name: 'psiTests' }],
                    },
                ],
            },
            user_id,
        );

        if (user?.groups)
            user.groups.forEach((group) => result.push(...group.psiTests));

        return result;
    }

    public async createMyGroup(group, id_user: number) {
        const newGroup = await this.groupService.create(group);

        const user: User = await this.getOne({}, id_user);
        user.enabled = 1;
        user.my_groups.push(newGroup);

        await user.save();

        return {
            newGroup,
        };
    }
}
