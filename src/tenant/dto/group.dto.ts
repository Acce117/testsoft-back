import { IsInt, IsOptional, IsString } from 'class-validator';

export class GroupDto {
    @IsString({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    name_group: string;

    @IsInt({ groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    father_group: number;
}
