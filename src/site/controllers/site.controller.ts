import { Body, Controller, Get, Post } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { CreateUserDto } from '../dto/register_user.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { instanceToPlain } from 'class-transformer';

@Controller()
export class SiteController {
    constructor(private readonly siteService: SiteService) {}

    @Post('/login')
    login(@Body() credentials: UserCredentials) {
        return this.siteService.login(credentials);
    }

    @Post('/sign_in')
    signIn(@Body() user: CreateUserDto) {
        return this.siteService.signIn(user);
    }

    @Get('/me')
    async me(@JwtPayload() payload) {
        const user = await this.siteService.me(payload.user_id);
        return instanceToPlain(user);
    }
}
