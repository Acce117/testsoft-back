import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
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
import { AuthAssignmentService } from './services/AuthAssignment.service';
import { UserSubscriber } from './models/user.subscriber';
import { ClientController } from './controllers/client.controller';
import { AuthAssignmentController } from './controllers/authAssignment.controller';
import { FunctionalRole } from './models/functional_role.entity';
import { FunctionalRoleController } from './controllers/functional_role.controller';
import { FunctionalRoleService } from './services/functional_role.service';
import { Leadership } from './models/leadership.entity';
import { Compatibility } from './models/compatibility.entity';
import { CompatibilityController } from './controllers/compatibility.controller';
import { LeadershipController } from './controllers/leadership.controller';
import { CompatibilityService } from './services/compatibility.service';
import { LeadershipService } from './services/leadership.service';
import { SendMailModule } from 'src/mailer/sendMail.module';
import { SelectedRoleService } from './services/selected_role.service';
import { SelectedRoleController } from './controllers/selected_role.controller';
import { SelectedRole } from './models/selected_role.entity';
import { FunctionalRoleGetAllMiddleware } from './middleware/FunctionalRoleGetAll.middleware';
import { AuthAssignmentSubscriber } from './models/auth_assignment.subscriber';
import { AuthItemService } from './services/authItem.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientService } from './services/client.service';
import { Client } from './models/client.entity';

@Module({
    controllers: [
        GroupController,
        UserController,
        CountryController,
        ClientController,
        AuthAssignmentController,
        FunctionalRoleController,
        CompatibilityController,
        LeadershipController,
        SelectedRoleController,
    ],
    providers: [
        GroupService,
        UserService,
        CountryService,
        AuthAssignmentService,
        FunctionalRoleService,
        CompatibilityService,
        LeadershipService,
        SelectedRoleService,
        AuthItemService,
        UserSubscriber,
        AuthAssignmentSubscriber,
        FunctionalRoleGetAllMiddleware,
        ClientService,
    ],
    imports: [
        SendMailModule,
        TypeOrmModule.forFeature([
            Client,
            Group,
            User,
            AuthItem,
            Country,
            AuthAssignment,
            FunctionalRole,
            Leadership,
            Compatibility,
            SelectedRole,
        ]),
        // SendMailModule,
        JwtModule,
    ],
    exports: [UserService, AuthAssignmentService, GroupService],
})
export class TenantModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(FunctionalRoleGetAllMiddleware)
            .forRoutes({ method: RequestMethod.GET, path: 'functional_role' });
    }
}
