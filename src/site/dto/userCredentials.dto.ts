import { IsEmail, IsString } from 'class-validator';

export class UserCredentials {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
