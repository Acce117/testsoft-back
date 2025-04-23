import { IsInt, IsDefined, IsArray, ArrayNotEmpty } from 'class-validator';
import { ValueAnswer } from '../classes/finalAnswers';

export class ExecuteTestDto {
    @IsDefined()
    @IsInt()
    id_test: number;

    @IsArray()
    @ArrayNotEmpty()
    answers: Array<{
        answer: string | ValueAnswer | Array<number> | number;
        id_question: number;
        top_value?: number;
        id_answer?: number | Array<number>;
    }>;

    user_id?: any;
    group_id?: any;
}
