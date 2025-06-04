import {
    IsArray,
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator';

export class PsiTestDto {
    @IsString({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    name: string;

    @IsString({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    description: string;

    @IsInt({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    recurring_time: number;

    @IsInt({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    time_duration: number;

    @IsBoolean({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    navigable: boolean;

    @IsBoolean({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    completed: boolean;

    @IsInt({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    fk_id_type_test: number;

    @IsBoolean({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    done: boolean;

    @IsString({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    language: string;

    @IsArray({ groups: ['create', 'update'] })
    @IsOptional({ always: true })
    authors: [];

    @IsInt({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    id_owner: number;
}
