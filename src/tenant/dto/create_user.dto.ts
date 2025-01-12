import {
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    CI: string;

    @IsString()
    name: string;

    @IsString()
    last_name: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEmail()
    email: string;

    @IsEnum(['M', 'F'])
    sex: 'M' | 'F';

    @IsNumber()
    @IsOptional()
    country_id?: string;
}
