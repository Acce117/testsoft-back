import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { CreateUserDto } from '../dto/register_user.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { instanceToPlain } from 'class-transformer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { handleTransaction } from 'src/common/utils/handleTransaction';

@Controller()
export class SiteController {
    @InjectDataSource() private readonly dataSource: DataSource;

    constructor(private readonly siteService: SiteService) {}

    @Post('/login')
    async login(@Body() credentials: UserCredentials) {
        return await handleTransaction(this.dataSource, async () =>
            this.siteService.login(credentials),
        );
    }

    @Post('/sign_in')
    async signIn(@Body() user) {
        return await handleTransaction(
            this.dataSource,
            async () => await this.siteService.signIn(user),
        );
    }

    @Get('/me')
    async me(@JwtPayload() payload) {
        const user = await this.siteService.me(payload.user_id);
        return instanceToPlain(user);
    }
}
