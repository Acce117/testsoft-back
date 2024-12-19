import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../tenant/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/register_user.dto';
import { UserCredentials } from '../dto/userCredentials.dto';
import { User } from '../../tenant/models/user.entity';

@Injectable()
export class SiteService {
    @Inject(JwtService) private readonly jwtService: JwtService;
    @Inject(UserService) private readonly userService: UserService;

    public async signIn(user: CreateUserDto) {
        const newUser = await this.userService.create(user);

        return {
            token: this.generateToken(newUser),
            user: newUser,
        };
    }

    public async login(credentials: UserCredentials) {
        const user: User = await this.userService.getOne({
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

        return { token: this.generateToken({ user_id: user.user_id }) };
    }

    public me(id_user) {
        return this.userService.getOne([], id_user);
    }

    private generateToken(payload: object) {
        return this.jwtService.sign(payload);
    }
}
