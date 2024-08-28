import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/services/service';
import { User } from '../models/user.entity';

@Injectable()
export class UserService extends AbstractService {
    protected model = User;
}
