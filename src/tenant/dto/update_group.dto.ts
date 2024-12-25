import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create_group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
