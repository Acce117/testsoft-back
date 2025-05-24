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
            where: data.map((e: BelbinGeneralResults) => e.id_test_application),
        });

        const examined = await this.belbinGeneralResultsRepository.query(
            'SELECT count(DISTINCT user_id, `group`) examined FROM resultados_generales_de_belbin where `group` in (?)',
            [groups_id],
        );

        const testResults = testApps.map((ta) =>
            this.executeTestService.testResult(ta),
        );

        return {
            examined,
            testResults,
        };
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
                if (result.categories[category])
                    result.categories[category] += 1;
                else result.categories[category] = 1;
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
}
