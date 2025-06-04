import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UserDto {
    @IsString({
        groups: ['create'],
    })
    @IsOptional({ groups: ['update'] })
    CI: string;

    @IsString({
        groups: ['create'],
    })
    @IsOptional({ groups: ['update'] })
    name: string;

    @IsString({
        groups: ['create'],
    })
    @IsOptional({ groups: ['update'] })
    last_name: string;

    @IsString({
        groups: ['create'],
    })
    @IsOptional({ groups: ['update'] })
    username: string;

    @IsString({
        groups: ['create'],
    })
    @IsOptional({ groups: ['update'] })
    password: string;

    @IsEmail()
    @IsOptional({ groups: ['update'] })
    email: string;

    @IsEnum(['M', 'F'], { groups: ['create'] })
    @IsOptional({ groups: ['update'] })
    sex: 'M' | 'F';

    @IsNumber()
    @IsOptional()
    country_id?: string;

    @IsArray()
    @IsOptional()
    assignments: [];
}
