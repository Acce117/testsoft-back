import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OnlyRedirectGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        if (
            !req.headers.referer ||
            !req.headers.referer.includes(process.env.DOMAIN)
        ) {
            throw new NotFoundException();
        }

        return true;
    }
}
