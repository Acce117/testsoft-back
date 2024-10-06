import { IsString } from 'class-validator';

export class PsiTestDto {
    @IsString()
    attribute: string;

    constructor({ attribute }) {
        this.attribute = attribute;
    }
}
