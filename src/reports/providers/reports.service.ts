import { Inject, Injectable } from '@nestjs/common';
import { BelbinGeneralResults } from '../models/BelbinGeneralResults.model';
import { DataSource, Repository } from 'typeorm';
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
import { Group } from 'src/tenant/models/group.entity';
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

    private async baseData(group_id, reportModel) {
        const result: { examined: number; testResults: Array<any> } = {
            examined: 0,
            testResults: [],
        };

        const groups: Group[] = await this.groupService.getDescendants(
            {},
            group_id,
        );

        const groups_id: number[] = groups.map((group) => group.id_group);
        const data = await this.queryFactory
            .selectQuery(
                {
                    where: groups_id,
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
                where: data.map(
                    (e: BelbinGeneralResults) => e.id_test_application,
                ),
            });

            const testResults = testApps.map((ta) =>
                this.executeTestService.testResult(ta),
            );

            result.testResults = testResults;
        }

        const examined = await this.belbinGeneralResultsRepository.query(
            'SELECT count(DISTINCT user_id, `group`) examined FROM resultados_generales_de_belbin where `group` in (?)',
            [groups_id],
        );

        result.examined = examined;

        return result;
    }

    async getBelbinGeneralResults(group_id) {
        const { examined, testResults } = await this.baseData(
            group_id,
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

    async getMBTIGeneralResults(group_id) {
        const { examined, testResults } = await this.baseData(
            group_id,
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

    getTEGeneralResults() {
        return this.teGeneralResultsRepository.find();
    }

    getLeyesGeneralResults() {
        return this.leyesGeneralResultsRepository.find();
    }

    getTermanGeneralResults() {
        return this.termanGeneralResultsRepository.find();
    }

    getCIGeneralResults() {
        return this.ciGeneralResultsRepository.find();
    }

    getTestAppCount() {
        return this.testAppCountRepository.find();
    }

    getTestResultAnalysis() {
        return this.testResultAnalysisRepository.find();
    }

    async amountOfTestedInGroup(group_id: any) {
        const data: Array<{ group_id: number; name: string; tested: string }> =
            await this.dataSource.query(`
            select auth_assignment.group_id, test.name, count(DISTINCT test_application.fk_id_user) tested
            from 
		        user join auth_assignment on user.user_id = auth_assignment.user_id
	            join test_application on user.user_id = test_application.fk_id_user
        		join test on test_application.fk_id_test = test.id_test
            where auth_assignment.group_id = ${group_id}
            GROUP BY test.name, auth_assignment.group_id
            ORDER BY auth_assignment.group_id
        `);

        const result: { [test: string]: number } = {};

        if (data.length != 0) {
            for (const element of data)
                result[element.name] = parseInt(element.tested);
        }

        return result;
    }

    preferredAvoidedRoles(group_id: any) {
        return this.preferredAvoidedRolesRepository.find({
            where: {
                fk_id_group: group_id,
            },
        });
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
}
