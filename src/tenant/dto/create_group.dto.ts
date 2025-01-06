import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    name_group: string;

    @IsInt()
    @IsOptional()
    father_group: number;

    constructor({ name_group, father_group }) {
        this.name_group = name_group;
        this.father_group = father_group;
    }
}
