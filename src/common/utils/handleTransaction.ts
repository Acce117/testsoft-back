import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, TypeORMError } from 'typeorm';

export async function handleTransaction(
    dataSource: DataSource,
    cb: CallableFunction,
    errorCb?: CallableFunction,
) {
    const queryRunner = dataSource.createQueryRunner();
    let result = null;
    try {
        await queryRunner.startTransaction();

        result = await cb(queryRunner.manager);

        await queryRunner.commitTransaction();
    } catch (e) {
        await queryRunner.rollbackTransaction();

        BadRequestException;
        if (errorCb) errorCb();

        if (e instanceof TypeORMError) {
            if ((e as any).errno === 1451) {
                throw new HttpException(
                    'Related element, not possible to delete',
                    HttpStatus.CONFLICT,
                );
            }
        } else result = e;
    } finally {
        await queryRunner.release();
    }

    return result;
}
