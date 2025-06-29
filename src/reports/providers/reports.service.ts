import { Inject, Injectable } from '@nestjs/common';
import { BelbinGeneralResults } from '../models/BelbinGeneralResults.model';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MBTIGeneralResults } from '../models/MBTIGeneralResults.model';
import { TEGeneralResults } from '../models/TEGeneralResults.model';
import { TestAppCount } from '../models/TestAppCount.model';
import { TestResultAnalysis } from '../models/TestResultAnalysus.model';
import { PreferredAvoidedRoles } from '../models/PreferredAvoidedRoles.model';
import { LeyesGeneralResults } from '../models/LeyesGeneralResults.model';
import { CIGeneralResults } from '../models/CIGeneralResults.model';
import { TermanGeneralResults } from '../models/TermanGeneralResults.model';
import { QueryFactory } from 'src/common/services/query-factory';
import { GroupService } from 'src/tenant/services/group.service';
import { TestApplicationService } from 'src/executeTest/services/testApplication.service';
import { ExecuteTestService } from 'src/executeTest/services/executeTest.service';
import { Compatibility } from 'src/tenant/models/compatibility.entity';
import { Leadership } from 'src/tenant/models/leadership.entity';

@Injectable()
export class ReportsService {
    @Inject(QueryFactory) queryFactory: QueryFactory;

    @Inject(GroupService) groupService: GroupService;

    @Inject(TestApplicationService) testAppService: TestApplicationService;

    @Inject(ExecuteTestService) executeTestService: ExecuteTestService;

    @InjectRepository(BelbinGeneralResults)
    belbinGeneralResultsRepository: Repository<BelbinGeneralResults>;

    @InjectRepository(MBTIGeneralResults)
    mbtiGeneralResultsRepository: Repository<MBTIGeneralResults>;

    @InjectRepository(TEGeneralResults)
    teGeneralResultsRepository: Repository<TEGeneralResults>;

    @InjectRepository(TestAppCount)
    testAppCountRepository: Repository<TestAppCount>;

    @InjectRepository(TestResultAnalysis)
    testResultAnalysisRepository: Repository<TestResultAnalysis>;

    @InjectRepository(PreferredAvoidedRoles)
    preferredAvoidedRolesRepository: Repository<PreferredAvoidedRoles>;

    @InjectDataSource() dataSource: DataSource;

    @InjectRepository(LeyesGeneralResults)
    leyesGeneralResultsRepository: Repository<LeyesGeneralResults>;

    @InjectRepository(CIGeneralResults)
    ciGeneralResultsRepository: Repository<CIGeneralResults>;

    @InjectRepository(TermanGeneralResults)
    termanGeneralResultsRepository: Repository<TermanGeneralResults>;

    private async baseData(groups, reportModel) {
        const result: { examined: number; testResults: Array<any> } = {
            examined: 0,
            testResults: [],
        };

        const data = await this.queryFactory
            .selectQuery(
                {
                    where: groups,
                },
                reportModel,
            )
            .getMany();

        if (data.length > 0) {
            const testApps = await this.testAppService.getAll({
                relations: [
                    'test.display_parameters',
                    {
                        name: 'application_result',
                        relations: [
                            {
                                name: 'item',
                                relations: ['ranges', 'category'],
                            },
                        ],
                    },
                ],
                where: data.map((e: any) => e.id_test_application),
            });

            const testResults = [];
            for (const ta of testApps) {
                const tr = await this.executeTestService.testResult(ta);
                testResults.push(tr);
            }

            result.testResults = testResults;
        }

        const view_name = (reportModel.getRepository() as Repository<any>)
            .metadata.tableName;
        const examined = await reportModel
            .getRepository()
            .query(
                `SELECT count(DISTINCT user_id, \`group\`) examined FROM ${view_name} where \`group\` in (?)`,
                [groups],
            );

        result.examined = examined;

        return result;
    }

    async getBelbinGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            BelbinGeneralResults,
        );

        const result: {
            examined: number;
            avoided: {
                [item: string]: number;
            };
            preferred: {
                [item: string]: number;
            };
        } = {
            examined: parseInt(examined[0].examined),
            avoided: {},
            preferred: {},
        };

        testResults.forEach((tr) => {
            for (const { item } of tr.preferred) {
                if (result.preferred[item.name])
                    result.preferred[item.name] += 1;
                else result.preferred[item.name] = 1;
            }

            for (const { item } of tr.avoided) {
                if (result.avoided[item.name]) result.avoided[item.name] += 1;
                else result.avoided[item.name] = 1;
            }
        });

        return result;
    }

    async getMBTIGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            MBTIGeneralResults,
        );

        const result: {
            examined: number;
            categories: { [category: string]: number };
        } = { examined: parseInt(examined[0].examined), categories: {} };

        testResults.forEach((tr) => {
            for (const category in tr.categories) {
                if (result.categories[tr.categories[category].items[0].name])
                    result.categories[tr.categories[category].items[0].name] +=
                        1;
                else
                    result.categories[tr.categories[category].items[0].name] =
                        1;
            }
        });

        return result;
    }

    async getTEGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            MBTIGeneralResults,
        );

        const result: {
            examined: number;
            categories: { [category: string]: number };
        } = { examined: parseInt(examined[0].examined), categories: {} };

        testResults.forEach((tr) => {
            for (const category in tr.categories) {
                if (result.categories[tr.categories[category].items[0].name])
                    result.categories[tr.categories[category].items[0].name] +=
                        1;
                else
                    result.categories[tr.categories[category].items[0].name] =
                        1;
            }
        });

        return result;
    }

    async getLeyesGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            MBTIGeneralResults,
        );

        const result: {
            examined: number;
            categories: { [category: string]: number };
        } = { examined: parseInt(examined[0].examined), categories: {} };

        testResults.forEach((tr) => {
            for (const category in tr.categories) {
                if (result.categories[tr.categories[category].items[0].name])
                    result.categories[tr.categories[category].items[0].name] +=
                        1;
                else
                    result.categories[tr.categories[category].items[0].name] =
                        1;
            }
        });

        return result;
    }

    async getTermanGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            MBTIGeneralResults,
        );

        const result: {
            examined: number;
            categories: { [category: string]: number };
        } = { examined: parseInt(examined[0].examined), categories: {} };

        testResults.forEach((tr) => {
            for (const category in tr.categories) {
                if (result.categories[tr.categories[category].items[0].name])
                    result.categories[tr.categories[category].items[0].name] +=
                        1;
                else
                    result.categories[tr.categories[category].items[0].name] =
                        1;
            }
        });

        return result;
    }

    async getCIGeneralResults(groups) {
        const { examined, testResults } = await this.baseData(
            groups,
            CIGeneralResults,
        );

        const result: {
            examined: number;
            categories: {
                [item: string]: {
                    malo: number;
                    aceptable: number;
                    excelente: number;
                };
            };
        } = {
            examined: parseInt(examined[0].examined),
            categories: {},
        };

        testResults.forEach((tr) => {
            for (const category in tr.categories) {
                tr.categories[category].items.forEach((item) => {
                    if (!result.categories[item.name])
                        result.categories[item.name] = {
                            malo: 0,
                            aceptable: 0,
                            excelente: 0,
                        };

                    item.ranges.forEach((range) => {
                        if (
                            item.value > range.min_val &&
                            item.value < range.max_val
                        )
                            result.categories[item.name][
                                range.indicator.toLowerCase()
                            ] += 1;
                    });
                });
            }
        });

        return result;
    }

    getTestAppCount() {
        return this.testAppCountRepository.find();
    }

    getTestResultAnalysis() {
        return this.testResultAnalysisRepository.find();
    }

    async amountOfTestedInGroup(groups: any) {
        const data: Array<{ group_id: number; name: string; tested: string }> =
            await this.dataSource.query(`
            select auth_assignment.group_id, test.name, count(DISTINCT test_application.fk_id_user) tested
            from 
		        user join auth_assignment on user.user_id = auth_assignment.user_id
	            join test_application on user.user_id = test_application.fk_id_user
        		join test on test_application.fk_id_test = test.id_test
            where auth_assignment.group_id in (${groups})
            GROUP BY test.name, auth_assignment.group_id
            ORDER BY auth_assignment.group_id
        `);

        const result: { [test: string]: number } = {};

        if (data.length != 0) {
            for (const element of data) {
                if (!result[element.name]) result[element.name] = 0;

                result[element.name] += parseInt(element.tested);
            }
        }

        return result;
    }

    async preferredAvoidedRoles(groups) {
        const data = await this.preferredAvoidedRolesRepository.find({
            where: {
                fk_id_group: In(groups),
            },
        });

        const result: {
            [functional_role: string]: {
                preferred: number;
                avoided: number;
            };
        } = {};

        data.forEach((item) => {
            if (!result[item.role_name]) {
                result[item.role_name] = {
                    preferred: 0,
                    avoided: 0,
                };
            }
            result[item.role_name].preferred += item.preferred;
            result[item.role_name].avoided += item.avoided;
        });

        return result;
    }

    async mostConsidered(group_id: any) {
        const compatibility_data = await Compatibility.getRepository().query(`
            SELECT 
                compatible,
                fk_user_destination,
                COUNT(*) as count,
		        compatibility.fk_id_group,
                user.name,
                user.user_id
            FROM 
                compatibility join user 
                on compatibility.fk_user_destination = user.user_id
            where compatibility.fk_id_group = ${group_id}
            GROUP BY compatible, fk_user_destination
            ORDER BY count DESC, compatible DESC
        `);

        const leadership_data = await Leadership.getRepository().query(`
            SELECT 
                fk_user_destination,
                COUNT(*) as count,
		        leadership.fk_id_group,
		        user.name,
                user.user_id
            FROM 
                leadership
                join user on leadership.fk_user_destination = user.user_id
            where leadership.fk_id_group = ${group_id}
            GROUP BY fk_user_destination
            ORDER BY count DESC
        `);

        const result = {
            most_considered_leader: null,
            most_compatible: null,
            less_compatible: null,
        };

        if (compatibility_data.length > 0) {
            result.most_compatible = compatibility_data.find(
                (item) => item.compatible == 1,
            );
            result.less_compatible = compatibility_data.find(
                (item) => item.compatible == 0,
            );
        }

        if (leadership_data.length > 0) {
            result.most_considered_leader = leadership_data[0];
        }

        return result;
    }

    async MBTIWithBelbinAnalytics(groups: Array<string>) {
        const result: {
            [key: string]: {
                cerebro: number;
                'monitor-evaluador': number;
                especialista: number;
                impulsor: number;
                implementador: number;
                finalizador: number;
                'investigador de recursos': number;
                coordinador: number;
                cohesionador: number;
            };
        } = {};

        const mbtiTestApps = await this.testAppService.getAll({
            relations: [
                'test.display_parameters',
                {
                    name: 'application_result',
                    relations: [
                        {
                            name: 'item',
                            relations: ['ranges', 'category'],
                        },
                    ],
                },
            ],
            where: {
                fk_id_group: groups,
                fk_id_test: 4,
            },
        });

        const belbinTestApps = await await this.testAppService.getAll({
            relations: [
                'test.display_parameters',
                {
                    name: 'application_result',
                    relations: [
                        {
                            name: 'item',
                            relations: ['ranges', 'category'],
                        },
                    ],
                },
            ],
            where: {
                fk_id_group: groups,
                fk_id_test: 3,
            },
        });

        let mta = null;
        let bta = null;
        for (let i = 0; i < mbtiTestApps.length; i++) {
            mta = mbtiTestApps[i];

            bta = belbinTestApps.find((b) => b.fk_id_user === mta.fk_id_user);

            if (bta) {
                const mtr: any = await this.executeTestService.testResult(mta);
                const btr: any = await this.executeTestService.testResult(bta);

                const mtype =
                    `${mtr.categories['Energía'].items[0].name}` +
                    `${mtr.categories['Percepción'].items[0].name}` +
                    `${mtr.categories['Decisión'].items[0].name}` +
                    `${mtr.categories['Vida'].items[0].name}`;

                if (!result[mtype]) {
                    result[mtype] = {
                        'investigador de recursos': 0,
                        'monitor-evaluador': 0,
                        cerebro: 0,
                        cohesionador: 0,
                        coordinador: 0,
                        especialista: 0,
                        finalizador: 0,
                        implementador: 0,
                        impulsor: 0,
                    };
                }

                btr.preferred.forEach((p) => {
                    result[mtype][p.item.name.toLowerCase().trim()] += 1;
                });
            }
        }

        return result;
    }
}
