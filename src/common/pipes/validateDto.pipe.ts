import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from '@nestjs/common';
import { validateSync } from 'class-validator';

export class ValidateDtoPipe implements PipeTransform {
    constructor(private readonly dtoType: any = null) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: any, metadata: ArgumentMetadata) {
        if (this.dtoType) {
            const dto = new this.dtoType(value);
            const validation = validateSync(dto);

            if (validation.length > 0)
                throw new BadRequestException(validation);
        }

        return value;
    }
}
