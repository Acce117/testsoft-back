import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { jwtPayload } from 'src/common/decorators/jwtPayload.decorator';
import { TestAuthor } from '../models/test_author.entity';

export class MyTestsInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Promise<Observable<any>> {
        const { user_id } = jwtPayload(context);

        return next.handle().pipe(
            map(async (value) => {
                const test_authors = await TestAuthor.getRepository().find({
                    where: {
                        user_id,
                    },
                });

                const filtered = [];

                value.forEach((element) => {
                    if ([3, 4, 7, 12, 14, 15].includes(element.id_test))
                        filtered.push(element);
                    else {
                        if (
                            test_authors.find(
                                (ta) => ta.test_id === element.id_test,
                            )
                        )
                            filtered.push(element);
                    }
                });
                return filtered;
            }),
        );
    }
}
