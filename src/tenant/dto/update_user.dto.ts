import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/site/dto/register_user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
