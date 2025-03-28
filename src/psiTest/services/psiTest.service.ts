import { Inject } from '@nestjs/common';
import { PsiTest } from '../models/psiTest.entity';
import { CrudBaseService } from 'src/common/services/service';
import { GroupService } from 'src/tenant/services/group.service';
import { Group } from 'src/tenant/models/group.entity';
import { GroupForTestService } from './groupForTest.service';
import { CreatePsiTestDto } from '../dto/create_psiTest.dto';

export class PsiTestService extends CrudBaseService({
    model: PsiTest,
    delete: 'hard',
}) {
    @Inject(GroupService) groupService: GroupService;
    @Inject(GroupForTestService) groupForTestService: GroupForTestService;

    create(data: CreatePsiTestDto, manager?: any) {
        const aux = data.id_owner;
        const groups: Group[] = this.groupService.getAncestors({}, aux);
        if (groups.length != 0) {
            data.id_owner = groups[0].id_group;
        }
        return super.create(data, manager);
    }

    public async assignTestToGroup(id_group, id_test, manager) {
        const group = await this.groupService.getOne(
            { relations: ['psiTests'] },
            id_group,
        );

        const promises = [];

        this.assignTest(id_test, [group], manager, promises);

        return Promise.all(promises);
    }

    private assignTest(id_test, groups: Array<Group>, manager, promises) {
        groups.forEach((group) => {
            if (!group.psiTests.find((test) => test.id_test == id_test)) {
                promises.push(
                    this.groupForTestService.create(
                        {
                            fk_id_group: group.id_group,
                            fk_id_test: id_test,
                        },
                        manager,
                    ),
                );

                this.assignTest(id_test, group.children, manager, promises);
            }
        });
    }
}
