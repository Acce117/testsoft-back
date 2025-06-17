import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthAssignment } from '../models/auth_assignment.entity';
import { User } from '../models/user.entity';

@Injectable()
export class FunctionalRoleGetAllMiddleware implements NestMiddleware {
    @Inject(UserService) userService: UserService;

    async use(
        req: Request,
        res: Response,
        next: (error?: Error | any) => void,
    ) {
        const jwt = req.headers['authorization'].split(' ')[1];
        const payload = JSON.parse(atob(jwt.split('.')[1]));

        const user: User = await this.userService.getOne(
            {
                relations: ['assignments.role'],
            },
            payload.user_id,
        );

        const assignment: AuthAssignment = user.assignments.find(
            (assignment: AuthAssignment) =>
                assignment.group_id == payload.group ||
                assignment.role.name === 'Super Admin',
        );

        const query = req.query;

        if (assignment.role.name === 'Analyst')
            return res.redirect(
                `/functional_role/analyst?${query.limit ? 'limit=' + query.limit + '&' : ''}${query.offset ? 'offset=' + query.offset : ''}`,
            );
        else if (assignment.role.name === 'Executor')
            return res.redirect(
                `/functional_role/executor?${query.limit ? 'limit=' + query.limit + '&' : ''}${query.offset ? 'offset=' + query.offset : ''}`,
            );

        return next();
    }
}
