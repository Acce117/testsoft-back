import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './models/group.entity';
import { UserService } from './services/user.service';
import { User } from './models/user.entity';
import { AuthItem } from './models/auth_item.entity';
import { UserController } from './controllers/user.controller';

@Module({
    controllers: [GroupController, UserController],
    providers: [GroupService, UserService],
    imports: [TypeOrmModule.forFeature([Group, User, AuthItem])],
    exports: [UserService],
})
export class TenantModule {}
