import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './models/group.entity';
import { UserService } from './services/user.service';
import { User } from './models/user.entity';
import { AuthItem } from './models/auth_item.entity';
import { UserController } from './controllers/user.controller';
import { Country } from './models/country.entity';
import { CountryService } from './services/country.service';
import { CountryController } from './controllers/country.controller';
import { AuthAssignment } from './models/auth_assignment.entity';

@Module({
    controllers: [GroupController, UserController, CountryController],
    providers: [GroupService, UserService, CountryService],
    imports: [
        TypeOrmModule.forFeature([
            Group,
            User,
            AuthItem,
            Country,
            AuthAssignment,
        ]),
    ],
    exports: [UserService],
})
export class TenantModule {}
