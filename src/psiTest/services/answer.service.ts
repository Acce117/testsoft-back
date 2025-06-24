import { CrudBaseService } from 'src/common/services/service';
import { Answer } from '../models/answer.entity';
import { TributeService } from './tribute.service';
import { Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Tribute } from '../models/tribute.entity';

export class AnswerService extends CrudBaseService({
    model: Answer,
    delete: 'hard',
}) {
    @Inject(TributeService) tributeService: TributeService;

    async delete(id: any, manager?: EntityManager) {
        const tributes = await this.tributeService.getAll({
            where: {
                fk_id_answer: id,
            },
        });

        await manager.withRepository(Tribute.getRepository()).delete(tributes);

        return super.delete(id, manager);
    }
}
