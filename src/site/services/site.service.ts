import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../tenant/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/register_user.dto';
import { UserCredentials } from '../dto/userCredentials.dto';
import { User } from '../../tenant/models/user.entity';
import { AuthAssignmentService } from 'src/tenant/services/AuthAssignment.service';

@Injectable()
export class SiteService {
    @Inject(JwtService) private readonly jwtService: JwtService;
    @Inject(UserService) private readonly userService: UserService;
    @Inject(AuthAssignmentService)
    private readonly authAssignmentService: AuthAssignmentService;

    public async signIn(user: CreateUserDto) {
        const newUser: User = await this.userService.create(user);
        this.authAssignmentService.create({
            user_id: newUser.user_id,
            item_id: 4,
        });

        return {
            token: this.generateToken({ user_id: newUser.user_id }),
        };
    }

    public async login(credentials: UserCredentials) {
        const user: User = await this.userService.getOne({
            relations: ['groups'],
            where: {
                username: credentials.username,
                enabled: 1,
                deleted: 0,
            },
        });

        if (
            !user ||
            !bcrypt.compareSync(credentials.password, (user as User).password)
        )
            throw new UnauthorizedException('Wrong credentials');

        return {
            token: this.generateToken({
                user_id: user.user_id,
                group: user.groups.length > 0 ? user.groups[0].id_group : null,
            }),
        };
    }

    public me(id_user) {
        return this.userService.getOne(
            {
                relations: ['assignments.role'],
            },
            id_user,
        );
    }

    private generateToken(payload: object) {
        return this.jwtService.sign(payload);
    }
}
