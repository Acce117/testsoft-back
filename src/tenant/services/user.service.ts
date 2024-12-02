import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';

export class UserService extends CrudBaseService(User) {
    public async userTests(user_id: number) {
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

        return user?.groups
            ? user.groups.forEach((group) => group.psiTests)
            : [];
    }
}
