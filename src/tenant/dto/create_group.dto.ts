import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    name_group: string;

    @IsInt()
    @IsOptional()
    father_group: number;
}
