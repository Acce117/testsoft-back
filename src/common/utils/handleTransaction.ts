import { DataSource } from 'typeorm';

export async function handleTransaction(
    dataSource: DataSource,
    cb: CallableFunction,
    errorCb?: CallableFunction,
) {
    const queryRunner = dataSource.createQueryRunner();
    let result = null;
    try {
        await queryRunner.startTransaction();
        result = await cb();

        await queryRunner.commitTransaction();
    } catch (e) {
        queryRunner.rollbackTransaction();

        if (errorCb) errorCb();

        result = e.message;
    }

    return result;
}
