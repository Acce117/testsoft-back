import { IsInt, IsDefined, IsArray, ArrayNotEmpty } from 'class-validator';

export class ExecuteTestDto {
    @IsDefined()
    @IsInt()
    id_test: number;

    @IsArray()
    @ArrayNotEmpty()
    answers: Array<{ answer: any; id_question: number; top_value?: number }>;

    user_id?: any;
    group_id?: any;
}
