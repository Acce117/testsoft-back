import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'preferred_avoided_roles',
})
export class PreferredAvoidedRoles {
    @ViewColumn({ name: 'fk_id_group' })
    fk_id_group: string;

    @ViewColumn({ name: 'role_name' })
    role_name: number;

    @ViewColumn({
        name: 'preferred',
        transformer: {
            from: (value) => parseInt(value),
            to: (value) => value,
        },
    })
    preferred: number;

    @ViewColumn({
        name: 'avoided',
        transformer: {
            from: (value) => parseInt(value),
            to: (value) => value,
        },
    })
    avoided: number;
}
