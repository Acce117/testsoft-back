import {
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateUserDto {
    constructor({
        CI,
        name,
        last_name,
        username,
        password,
        email,
        sex,
        country_id,
    }) {
        this.CI = CI;
        this.name = name;
        this.last_name = last_name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.sex = sex;
        this.country_id = country_id;
    }

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
