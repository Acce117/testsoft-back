import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { UserCredentials } from '../dto/userCredentials.dto';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { UserDto } from 'src/tenant/dto/user.dto';
import { User } from 'src/tenant/models/user.entity';
import { instanceToPlain } from 'class-transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { BulkJobOptions, Queue } from 'bullmq';
import { AuthAssignmentService } from 'src/tenant/services/AuthAssignment.service';
import { AuthAssignment } from 'src/tenant/models/auth_assignment.entity';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Controller()
export class SiteController {
    @InjectDataSource() private readonly dataSource: DataSource;
    @Inject(AuthAssignmentService)
    private readonly authAssignmentService: AuthAssignmentService;

    constructor(
        private readonly siteService: SiteService,
        @InjectQueue('mails') readonly mailsQueue: Queue,
    ) {}

    @Post('/login')
    async login(
        @Body(new ValidationPipe({ groups: ['login'] }))
        credentials: UserCredentials,
    ) {
        return this.siteService.login(credentials);
    }

    @Post('/sign_in')
    async signIn(
        @Body(
            'user',
            new ValidationPipe({
                groups: ['sign_in'],
            }),
        )
        user: UserDto,
        @Body('group') group,
    ) {
        const result = await handleTransaction(
            this.dataSource,
            async (manager) =>
                await this.siteService.signIn(user, group, manager),
        );

        if (result instanceof User) this.notifySuperAdmins(result);

        return instanceToPlain(result);
    }

    async notifySuperAdmins(result: User) {
        const assignments: AuthAssignment[] =
            await this.authAssignmentService.getAll({
                relations: ['users'],
                where: {
                    item_id: 4,
                },
            });

        const jobs: {
            name: string;
            data: ISendMailOptions;
            options?: BulkJobOptions;
        }[] = [];

        assignments.forEach((assignment) => {
            jobs.push({
                name: 'do_test',
                data: {
                    to: assignment.users.email,
                    subject: 'A new client has been registered',
                    template: './new_client',
                    context: {
                        client: result.name,
                    },
                },
            });
        });

        this.mailsQueue.addBulk(jobs);
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
