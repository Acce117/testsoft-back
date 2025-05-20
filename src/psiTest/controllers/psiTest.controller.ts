import { Body, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePsiTestDto } from '../dto/create_psiTest.dto';
import { UpdatePsiTestDto } from '../dto/update_psiTest.dto';
import { PsiTestService } from '../services/psiTest.service';
import { CrudBaseController } from 'src/common/controllers/controller';
import { RoleGuard, Roles } from 'src/tenant/guards/RoleGuard.guard';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { MyTestsInterceptor } from '../interceptor/myTests.interceptor';
import { AssignedTestGuard } from '../guards/AssignedTest.guard';
import { AllowAssignTestGuard } from '../guards/allowAssignTest.guard';

export class PsiTestController extends CrudBaseController({
    prefix: 'psi_test',
    service: PsiTestService,
    createDto: CreatePsiTestDto,
    updateDto: UpdatePsiTestDto,
    decorators: [UseGuards(RoleGuard), Roles(['Analyst', 'Super Admin'])],
    getAll: {
        decorators: [
            UseGuards(RoleGuard),
            Roles(['Executor']),
            UseInterceptors(MyTestsInterceptor),
        ],
    },
    getOne: {
        decorators: [
            UseGuards(RoleGuard, AssignedTestGuard),
            Roles(['Executor', 'Analyst']),
        ],
    },
}) {
    @Post('assign_test_to_group')
    @UseGuards(AllowAssignTestGuard)
    public assignTestToGroup(@Body() { id_group, id_test }) {
        return handleTransaction(this.dataSource, (manager) => {
            return (this.service as PsiTestService).assignTestToGroup(
                id_group,
                id_test,
                manager,
            );
        });
    }
}
