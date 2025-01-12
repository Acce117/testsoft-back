import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreatePsiTestDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsInt()
    recurring_time: number;

    @IsInt()
    time_duration: number;

    @IsBoolean()
    navigable: boolean;

    @IsBoolean()
    completed: boolean;

    @IsInt()
    fk_id_type_test: number;

    @IsBoolean()
    done: boolean;

    @IsString()
    language: string;
}
