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
        groups: ['create', 'update', 'sign_in'],
    })
    @IsOptional({ groups: ['update'] })
    CI: string;

    @IsString({
        groups: ['create', 'update', 'sign_in'],
    })
    @IsOptional({ groups: ['update'] })
    name: string;

    @IsString({
        groups: ['create', 'update', 'sign_in'],
    })
    @IsOptional({ groups: ['update'] })
    last_name: string;

    @IsString({
        groups: ['login', 'sign_in'],
    })
    password: string;

    @IsEmail({}, { groups: ['create', 'update', 'sign_in'] })
    @IsOptional({ groups: ['update'] })
    email: string;

    @IsEnum(['M', 'F'], {
        groups: ['create', 'update', 'sign_in'],
    })
    @IsOptional({ groups: ['update'] })
    sex: 'M' | 'F';

    @IsNumber(
        {},
        {
            groups: ['create', 'update', 'sign_in'],
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

    @IsBoolean({ groups: ['update'] })
    @IsOptional({ always: true })
    enabled: boolean;
}
