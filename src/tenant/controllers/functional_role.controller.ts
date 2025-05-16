import { CrudBaseController } from 'src/common/controllers/controller';
import { FunctionalRoleService } from '../services/functional_role.service';
import { Get, UseGuards } from '@nestjs/common';
import { OnlyRedirectGuard } from 'src/common/guards/onlyRedirect.guard';
import { JwtPayload } from 'src/common/decorators/jwtPayload.decorator';

export class FunctionalRoleController extends CrudBaseController({
    prefix: 'functional_role',
    service: FunctionalRoleService,
}) {
    @Get('/executor')
    @UseGuards(OnlyRedirectGuard)
    getFunctionalRoleForExecutor(@JwtPayload() payload) {
        return (
            this.service as FunctionalRoleService
        ).getFunctionalRoleForExecutor(payload.group);
    }

    @Get('analyst')
    @UseGuards(OnlyRedirectGuard)
    getFunctionalRoleForAnalyst(@JwtPayload() payload) {
        return (
            this.service as FunctionalRoleService
        ).getFunctionalRoleForAnalyst(payload.group);
    }
}
