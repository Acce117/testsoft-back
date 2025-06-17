import { Controller, Get, Inject } from '@nestjs/common';
import { IController } from 'src/common/controllers/controller.interface';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { DataSource } from 'typeorm';
import { MeService } from '../services/me.service';
import { instanceToPlain } from 'class-transformer';

@Controller('me')
export class MeController implements IController {
    @Inject(MeService) service: MeService;
    @Inject(DataSource) dataSource: DataSource;

    @Get()
    async me(@JwtPayload() payload) {
        const user = await this.service.me(payload.user_id);
        const plain_user = instanceToPlain(user);

        return {
            ...plain_user,
            assignments: undefined,
            assignment: user.assignments.find(
                (assign) =>
                    assign.group_id == payload.group ||
                    assign.role.name === 'Super Admin',
            ),
        };
    }
}
