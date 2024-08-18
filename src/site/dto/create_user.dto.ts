import { UserCredentials } from './userCredentials.dto';

export class CreateUserDto extends UserCredentials {
    constructor(data: CreateUserDto) {
        super();
        this.username = data.username;
        this.password = data.password;
    }
}
