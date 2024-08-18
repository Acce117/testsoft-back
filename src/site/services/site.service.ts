import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create_user.dto';
import { UserCredentials } from '../dto/userCredentials.dto';
import { User } from '../models/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class SiteService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    public async signIn(user: CreateUserDto) {
        const newUser = await this.userService.create(user);

        const userPjo = instanceToPlain(newUser);

        return {
            token: this.generateToken(userPjo),
            user: userPjo,
        };
    }

    public async login(credentials: UserCredentials) {
        const user = await this.userService.getOne({
            where: {
                username: credentials.username,
                deleted: 0,
            },
        });

        if (
            !user ||
            !bcrypt.compareSync(credentials.password, (user as User).password)
        )
            throw new UnauthorizedException('Wrong credentials');

        const userPjo = instanceToPlain(user);

        return {
            token: this.generateToken(userPjo),
            user: userPjo,
        };
    }

    private generateToken(payload: object) {
        return this.jwtService.sign(payload, {});
    }
}
