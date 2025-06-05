import {
    Body,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PsiTestDto } from '../dto/psiTest.dto';
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
    dto: PsiTestDto,

    decorators: [UseGuards(RoleGuard), Roles(['Analyst', 'Super Admin'])],
    getAll: {
        decorators: [UseInterceptors(MyTestsInterceptor)],
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

    @UseGuards(RoleGuard, AssignedTestGuard)
    @Roles(['Executor'])
    @Get('test_to_execute/:id_test')
    testToExecute(@Param('id_test') id_test: string) {
        return (this.service as PsiTestService).getOne(
            {
                relations: [
                    {
                        name: 'type_psi_test',
                    },
                    {
                        name: 'series',
                        relations: [
                            {
                                name: 'questions',
                                relations: [
                                    {
                                        name: 'type',
                                    },

                                    {
                                        name: 'top_value',
                                    },
                                    {
                                        name: 'answers',
                                        relations: ['tribute'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            id_test,
        );
    }
}
