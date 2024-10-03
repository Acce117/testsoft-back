import { IsInt, IsDefined, IsArray, ArrayNotEmpty } from 'class-validator';

export class ExecuteTestDto {
    @IsDefined()
    @IsInt()
    id_test: number;

    @IsArray()
    @ArrayNotEmpty()
    answers: { [key: number]: any };

    user_id?: any;
}
