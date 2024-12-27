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

    constructor({
        name,
        description,
        recurring_time,
        time_duration,
        navigable,
        completed,
        fk_id_type_test,
        done,
        language,
    }) {
        this.name = name;
        this.description = description;
        this.recurring_time = recurring_time;
        this.time_duration = time_duration;
        this.navigable = navigable;
        this.completed = completed;
        this.fk_id_type_test = fk_id_type_test;
        this.done = done;
        this.language = language;
    }
}
