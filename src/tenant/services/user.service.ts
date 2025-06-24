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
import { handleTransaction } from 'src/common/utils/handleTransaction';
import { UserDto } from '../dto/user.dto';
import { validateArray } from 'src/common/pipes/validateDto.pipe';
import { finished } from 'stream';
import { promisify } from 'util';
import { AuthAssignment } from '../models/auth_assignment.entity';
import { EntityManager } from 'typeorm';
import { readFile, utils } from 'xlsx';
import { CountryService } from './country.service';

export class UserService extends CrudBaseService({ model: User }) {
    @Inject(GroupService) private readonly groupService: GroupService;

    @Inject(SelectedRoleService)
    private readonly selectedRoleService: SelectedRoleService;

    @Inject(AuthItemService) private readonly authItemService: AuthItemService;

    @Inject(JwtService) private readonly jwtService: JwtService;

    @Inject(FSFileHandler) fileHandler: FSFileHandler;

    @Inject(CountryService) countryService: CountryService;

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
                    link: `${process.env.FRONT_DOMAIN}/accept_invitation?token=${this.jwtService.sign(
                        data,
                        {
                            secret: process.env.JWT_SECRET,
                        },
                    )}`,
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

    public async loadUsersFromCSV(
        file: Express.Multer.File,
        group_id,
        dataSource,
    ) {
        const { file_name, stream } = this.fileHandler.saveFile(file, '/xlsx');

        const finishedAsync = promisify(finished);

        await finishedAsync(stream.on('ready', () => {}));

        const workbook = readFile(
            join(process.cwd(), `/uploads/xlsx/${file_name}`),
            { cellText: true },
        );
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[] = utils.sheet_to_json(worksheet);

        const { validationResult } = validateArray(data, UserDto, ['create']);

        if (validationResult.length > 0)
            throw new BadRequestException(validationResult);

        const result = await handleTransaction(
            dataSource,
            async (manager: EntityManager) => {
                const users = [];
                for (const d of data) {
                    const country = await this.countryService.getOne({
                        where: {
                            name: d.country,
                        },
                    });

                    users.push({ ...d, country });
                }

                const result: User[] = await this.create(users, manager);

                result.forEach((user) => {
                    const assignment = new AuthAssignment();
                    assignment.group_id = group_id;
                    assignment.item_id = 3;

                    user.assignments = [assignment];
                });
                await manager.save(result);

                return result;
            },
        );

        this.fileHandler.deleteFile(
            join(process.cwd(), `uploads/xlsx/${file_name}`),
        );

        return result;
    }
}
