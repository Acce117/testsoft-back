import { Injectable } from '@nestjs/common';
import { BelbinGeneralResults } from '../models/BelbinGeneralResults.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MBTIGeneralResults } from '../models/MBTIGeneralResults.model';
import { TEGeneralResults } from '../models/TEGeneralResults.model';
import { TestAppCount } from '../models/TestAppCount.model';
import { TestResultAnalysis } from '../models/TestResultAnalysus.model';
import { PreferredAvoidedRoles } from '../models/PreferredAvoidedRoles.model';

@Injectable()
export class ReportsService {
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

    getBelbinGeneralResults() {
        return this.belbinGeneralResultsRepository.find();
    }

    getMBTIGeneralResults() {
        return this.mbtiGeneralResultsRepository.find();
    }

    getTEGeneralResults() {
        return this.teGeneralResultsRepository.find();
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
                id_group: group_id,
            },
        });
    }
}
