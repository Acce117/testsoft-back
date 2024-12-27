import { PartialType } from '@nestjs/mapped-types';
import { CreatePsiTestDto } from './create_psiTest.dto';

export class UpdatePsiTestDto extends PartialType(CreatePsiTestDto) {}
