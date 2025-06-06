import { CrudBaseService } from 'src/common/services/service';
import { User } from '../models/user.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { GroupService } from './group.service';
import { paginateResult } from 'src/common/utils/paginateResult';
import { SelectedRoleService } from './selected_role.service';
import { Group } from '../models/group.entity';
import { AuthItem } from '../models/auth_item.entity';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { AuthItemService } from './authItem.service';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FSFileHandler } from 'src/common/services/file-handler';
import { join } from 'path';
import csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';
import { validateArray } from 'src/common/pipes/validateDto.pipe';
import { finished } from 'stream';
import { promisify } from 'util';

export class UserService extends CrudBaseService({ model: User }) {
    @Inject(GroupService) private readonly groupService: GroupService;

    @Inject(SelectedRoleService)
    private readonly selectedRoleService: SelectedRoleService;

    @Inject(AuthItemService) private readonly authItemService: AuthItemService;

    @Inject(JwtService) private readonly jwtService: JwtService;

    @Inject(FSFileHandler) fileHandler: FSFileHandler;

    constructor(@InjectQueue('mails') private readonly mailsQueue: Queue) {
        super();
    }

    public async userTests(user_id: number, group_id, params) {
        const result = [];

        const user: User = await this.getOne(
            {
                relations: [
                    {
                        name: 'groups',
                        relations: [
                            {
                                name: 'psiTests',
                                relations: [
                                    {
                                        name: 'test_apps',
                                        where: {
                                            fk_id_user: user_id,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            user_id,
        );

        if (user?.groups) {
            const group = user.groups.find(
                (group) => group.id_group == group_id,
            );
            result.push(...group.psiTests);
        }

        return paginateResult(params, result);
    }

    async selectedRoles(user_id: any, group: any) {
        const selectedRoles = await this.selectedRoleService.getAll({
            relations: ['role'],
            where: {
                fk_id_user: user_id,
                fk_id_group: group,
            },
        });

        const result = selectedRoles.map((sr) => {
            sr.fk_id_group == group;
            return sr;
        });

        return result;
    }

    public async createMyGroup(group, id_user: number) {
        const newGroup = await this.groupService.create(group);

        const user: User = await this.getOne({}, id_user);
        user.enabled = true;
        user.my_groups.push(newGroup);

        await user.save();

        return {
            newGroup,
        };
    }

    async inviteToGroup(data: {
        group_id: string;
        user_id: string;
        item_id: string;
    }): Promise<any> {
        const user: User = await this.getOne({}, data.user_id);
        const group: Group = await this.groupService.getOne({}, data.group_id);
        const role: AuthItem = await this.authItemService.getOne(
            {},
            data.item_id,
        );

        //TODO terminar flujo, crear assignment
        try {
            const mailOptions: ISendMailOptions = {
                to: user.email,
                subject: 'Assigned to group with role',
                template: './notify_assignment',
                context: {
                    name: user.name,
                    group: group.name_group,
                    role: role.name,
                    link: `front-domain/${this.jwtService.sign(data)}`,
                    supportEmail: 'support@email.com',
                    supportPhone: 1234567,
                },
            };

            this.mailsQueue.add('assignment_to_group', mailOptions);
        } catch (error) {
            console.log(error);
        }
        return;
    }

    public async loadUsersFromCSV(file: Express.Multer.File, dataSource) {
        const { file_name, stream } = this.fileHandler.saveFile(file, '/csv');

        const results: any[] = [];

        const finishedAsync = promisify(finished);

        await finishedAsync(stream.on('ready', () => {}));
        await finishedAsync(
            createReadStream(join(process.cwd(), 'uploads/csv', file_name))
                .pipe(csvParser({ separator: ';' }))
                .on('data', (data) => results.push(data)),
        );

        // const { validationResult } = validateArray(results, UserDto);

        // if (validationResult.length > 0)
        //     throw new BadRequestException(validationResult);

        await handleTransaction(dataSource, async (manager) => {
            return await this.create(results, manager);
        });
        this.fileHandler.deleteFile(
            join(process.cwd(), 'uploads/csv', file_name),
        );

        return;
    }
}
