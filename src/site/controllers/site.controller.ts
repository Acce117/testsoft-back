import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { UserDto } from 'src/tenant/dto/user.dto';

@Controller()
export class SiteController {
    @InjectDataSource() private readonly dataSource: DataSource;

    constructor(private readonly siteService: SiteService) {}

    @Post('/login')
    async login(@Body() credentials: UserCredentials) {
        return this.siteService.login(credentials);
    }

    @Post('/sign_in')
    signIn(@Body('user') user: UserDto, @Body('group') group) {
        return handleTransaction(
            this.dataSource,
            async (manager) =>
                await this.siteService.signIn(user, group, manager),
        );
    }

    @Get('/select_group/:group_id')
    selectGroup(@JwtPayload() payload, @Param('group_id') group_id) {
        return this.siteService.selectGroup(payload.user_id, group_id);
    }

    @Post('refresh_token')
    refreshToken(@JwtPayload() payload) {
        return this.siteService.refreshToken(payload);
    }

    @Patch('/change_password')
    async changePassword(@Body() body, @JwtPayload() payload) {
        return handleTransaction(
            this.dataSource,
            async (manager) =>
                await this.siteService.changePassword(
                    payload.user_id,
                    body,
                    manager,
                ),
        );
    }

    @Post('/existing_user')
    existingUser(@Body('email') email: string) {
        return this.siteService.existingUser(email);
    }
}
