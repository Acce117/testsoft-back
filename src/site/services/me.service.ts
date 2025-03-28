import { Inject, Injectable } from '@nestjs/common';
import { QueryFactory } from 'src/common/services/query-factory';
import { UserService } from 'src/tenant/services/user.service';

@Injectable()
export class MeService {
    @Inject(QueryFactory) queryFactory: QueryFactory;
    @Inject(UserService) userService: UserService;

    public me(id_user) {
        return this.userService.getOne(
            {
                relations: ['assignments.role', 'groups'],
            },
            id_user,
        );
    }
}
