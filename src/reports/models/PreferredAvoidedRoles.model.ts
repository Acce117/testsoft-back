import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'preferred_avoided_roles',
})
export class PreferredAvoidedRoles {
    @ViewColumn({ name: 'id_group' })
    id_group: number;

    @ViewColumn({ name: 'rol_name' })
    rol_name: number;

    @ViewColumn({ name: 'how_many_preferred' })
    how_many_preferred: number;

    @ViewColumn({ name: 'how_many_avoided' })
    how_many_avoided: number;
}
