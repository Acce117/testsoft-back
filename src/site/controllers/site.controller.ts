import { Body, Controller, Post } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { CreateUserDto } from '../dto/create_user.dto';

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
}
