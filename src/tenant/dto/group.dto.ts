import { IsInt, IsOptional, IsString } from 'class-validator';

export class GroupDto {
    @IsString()
    name_group: string;

    @IsInt()
    @IsOptional()
    father_group: number;
}
