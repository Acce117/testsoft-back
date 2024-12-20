import { Body, Controller, Get, Post } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { CreateUserDto } from '../dto/register_user.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { instanceToPlain } from 'class-transformer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class SiteController {
    @InjectDataSource() private readonly dataSource: DataSource;

    constructor(private readonly siteService: SiteService) {}

    @Post('/login')
    login(@Body() credentials: UserCredentials) {
        return this.siteService.login(credentials);
    }

    @Post('/sign_in')
    async signIn(@Body() user) {
        const queryRunner = this.dataSource.createQueryRunner();
        let result = null;
        try {
            await queryRunner.startTransaction();
            result = await this.siteService.signIn(user);

            await queryRunner.commitTransaction();
        } catch (e) {
            queryRunner.rollbackTransaction();
            result = e.message;
        }

        return result;
    }

    @Get('/me')
    async me(@JwtPayload() payload) {
        const user = await this.siteService.me(payload.user_id);
        return instanceToPlain(user);
    }
}
