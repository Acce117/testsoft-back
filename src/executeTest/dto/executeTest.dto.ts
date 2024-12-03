import { IsInt, IsDefined, IsArray, ArrayNotEmpty } from 'class-validator';

export class ExecuteTestDto {
    @IsDefined()
    @IsInt()
    id_test: number;

    @IsArray()
    @ArrayNotEmpty()
    answers: Array<{ [key: number]: any; id_question: number }>;

    user_id?: any;
}
