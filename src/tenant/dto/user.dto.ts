import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UserDto {
    @IsString({
        groups: ['create', 'update'],
    })
    @IsOptional({ groups: ['update'] })
    CI: string;

    @IsString({
        groups: ['create', 'update'],
    })
    @IsOptional({ groups: ['update'] })
    name: string;

    @IsString({
        groups: ['create', 'update'],
    })
    @IsOptional({ groups: ['update'] })
    last_name: string;

    @IsString({
        groups: ['create', 'update'],
    })
    @IsOptional({ groups: ['update'] })
    username: string;

    @IsString({
        groups: ['login', 'sign_in'],
    })
    password: string;

    @IsEmail({}, { groups: ['create', 'update'] })
    @IsOptional({ groups: ['update'] })
    email: string;

    @IsEnum(['M', 'F'], {
        groups: ['create', 'update'],
    })
    @IsOptional({ groups: ['update'] })
    sex: 'M' | 'F';

    @IsNumber(
        {},
        {
            groups: ['create', 'update'],
        },
    )
    @IsOptional({ always: true })
    country_id?: string;

    @IsArray({
        groups: ['create', 'update'],
    })
    @IsOptional({
        always: true,
    })
    assignments: [];

    @IsBoolean({ groups: ['updated'] })
    enabled: boolean;
}
