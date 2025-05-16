import { CrudBaseService } from 'src/common/services/service';
import { FunctionalRole } from '../models/functional_role.entity';
import { GroupService } from './group.service';
import { Inject } from '@nestjs/common';
import { Group } from '../models/group.entity';

export class FunctionalRoleService extends CrudBaseService({
    model: FunctionalRole,
}) {
    @Inject(GroupService) groupService: GroupService;

    async getFunctionalRoleForExecutor(group_id) {
        const groups: Group[] = await this.groupService.getAncestors(
            {
                relations: ['functional_roles'],
            },
            group_id,
        );

        return this.getFunctionalRoles(groups);
    }

    async getFunctionalRoleForAnalyst(group_id) {
        const groups: Group[] = await this.groupService.getDescendants(
            {
                relations: ['functional_roles'],
            },
            group_id,
        );

        return this.getFunctionalRoles(groups);
    }

    private getFunctionalRoles(groups: Group[]) {
        const functional_roles = [];

        groups.forEach((g) => functional_roles.push(...g.functional_roles));
        return functional_roles;
    }
}
