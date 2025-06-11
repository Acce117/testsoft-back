import {
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../tenant/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserCredentials } from '../dto/userCredentials.dto';
import { User } from '../../tenant/models/user.entity';
import { AuthAssignmentService } from 'src/tenant/services/AuthAssignment.service';
import { GroupService } from 'src/tenant/services/group.service';
import { Group } from 'src/tenant/models/group.entity';
import { EntityManager } from 'typeorm';
import { UserDto } from 'src/tenant/dto/user.dto';

@Injectable()
export class SiteService {
    @Inject(JwtService) private readonly jwtService: JwtService;
    @Inject(UserService) private readonly userService: UserService;
    @Inject(GroupService) private readonly groupService: GroupService;
    @Inject(AuthAssignmentService)
    private readonly authAssignmentService: AuthAssignmentService;

    public async signIn(user: UserDto, group, manager: EntityManager) {
        const newUser: User = await this.userService.create(
            { ...user, created_scenario: 'sign_in' },
            manager,
        );
        const newGroup: Group = await this.groupService.create(
            { ...group, owner: [newUser] },
            manager,
        );

        await this.authAssignmentService.create(
            {
                user_id: newUser.user_id,
                item_id: 5,
                group_id: newGroup.id_group,
            },
            manager,
        );

        return newUser;
    }

    public async login(credentials: UserCredentials) {
        const user: User = await this.userService.getOne({
            relations: ['groups', 'assignments.role'],
            where: {
                username: credentials.username,
                enabled: 1,
                deleted: 0,
            },
        });

        let result = null;

        if (
            !user ||
            !bcrypt.compareSync(credentials.password, (user as User).password)
        )
            throw new UnauthorizedException('Wrong credentials');

        if (
            !user.assignments.find(
                (assignment) => assignment.role.name === 'Super Admin',
            )
        ) {
            const assignment = user.assignments.find(
                (assignment) => (assignment.group_id = user.groups[0].id_group),
            );

            switch (assignment.role.name) {
                case 'Client':
                    if (!user.enabled) throw new ForbiddenException();
                case 'Admin':
                    break;
                default:
                    const group = user.groups[0];
                    if (group.father_group === null) {
                        if (group.owner?.length > 0) {
                            group.owner.forEach((owner) => {
                                if (!owner.enabled)
                                    throw new ForbiddenException();
                            });
                        }
                    } else {
                        const ancestors = await this.groupService.getAncestors(
                            {
                                relations: ['owner'],
                            },
                            user.groups[0].id_group,
                        );
                        if (ancestors[0].owner.length > 0) {
                            ancestors[0].owner.forEach((owner) => {
                                if (!owner.enabled)
                                    throw new ForbiddenException();
                            });
                        }
                    }
            }

            const assignments = user.assignments.map((assignment) => {
                const role = assignment.role;
                const groups = user.groups;

                let result = null;
                let i = 0;
                while (!result) {
                    if (groups[i].id_group === assignment.group_id) {
                        result = {
                            id_group: groups[i].id_group,
                            name: groups[i].name_group,
                            role: role.name,
                        };
                    }

                    i++;
                }
                return result;
            });

            result = {
                token: this.jwtService.sign({
                    user_id: user.user_id,
                }),
                groups: assignments,
            };
        } else {
            result = {
                token: this.jwtService.sign({
                    user_id: user.user_id,
                }),
                refresh_token: this.jwtService.sign(
                    {
                        user_id: user.user_id,
                    },
                    {
                        expiresIn: '5h',
                    },
                ),
            };
        }

        return result;
    }

    public async selectGroup(user_id, group_id) {
        const assignment = await this.authAssignmentService.getOne({
            where: {
                user_id,
                group_id,
            },
        });

        if (!assignment) throw new UnauthorizedException();

        return {
            token: this.jwtService.sign({
                user_id,
                group: group_id,
            }),
            refresh_token: this.jwtService.sign(
                {
                    user_id,
                    group: group_id,
                },
                {
                    expiresIn: '5h',
                },
            ),
        };
    }

    refreshToken(payload: any) {
        return {
            token: this.jwtService.sign({
                user_id: payload.user_id,
                group: payload.group,
            }),
            refresh_token: this.jwtService.sign(
                { user_id: payload.user_id, group: payload.group },
                {
                    expiresIn: '5h',
                },
            ),
        };
    }

    public async changePassword(
        user_id,
        { old_password, new_password },
        manager: EntityManager,
    ) {
        const user: User = await this.userService.getOne({}, user_id);
        if (bcrypt.compareSync(old_password, user.password)) {
            user.password = new_password;
            manager.withRepository(User.getRepository()).save(user);
        } else throw new UnauthorizedException();
    }

    async existingUser(email: string) {
        const user: User = await this.userService.getOne({
            where: { email, deleted: 0 },
        });

        return user ? user.user_id : false;
    }
}
