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
            let validationResult = null;
            if (value instanceof Array) {
                validationResult = this.validateArray(value);
            } else {
                validationResult = validateSync(new this.dtoType(value));
            }

            if (validationResult.length > 0)
                throw new BadRequestException(validationResult);
        }

        return value;
    }

    validateArray(value) {
        const validationResult = [];
        let validation = null;

        for (let i = 0; i < value.length; i++) {
            validation = validateSync(new this.dtoType(value[i]));

            if (validation.length > 0)
                validationResult.push({ index: i, validation });
        }

        return validationResult;
    }
}
