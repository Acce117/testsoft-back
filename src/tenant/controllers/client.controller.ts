import { Controller, Get } from '@nestjs/common';
import { User } from '../models/user.entity';
import { AuthItem } from '../models/auth_item.entity';
import { AuthAssignment } from '../models/auth_assignment.entity';

@Controller('client')
export class ClientController {
    @Get()
    getClients() {
        return User.createQueryBuilder('users')
            .select()
            .innerJoinAndSelect(
                AuthAssignment,
                'assignments',
                'users.user_id = assignments.user_id',
            )
            .innerJoinAndSelect(
                AuthItem,
                'role',
                'role.item_id = assignments.item_id',
            )
            .where('role.name = "Client"')
            .getMany();
    }
}
