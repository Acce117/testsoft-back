import { Injectable } from '@nestjs/common';
import { BelbinGeneralResults } from '../models/BelbinGeneralResults.model';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MBTIGeneralResults } from '../models/MBTIGeneralResults.model';
import { TEGeneralResults } from '../models/TEGeneralResults.model';
import { TestAppCount } from '../models/TestAppCount.model';
import { TestResultAnalysis } from '../models/TestResultAnalysus.model';

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

    amountOfTestedInGroup(group_id: any) {
        return this.dataSource.query(`
            select count(DISTINCT test_application.fk_id_user, auth_assignment.group_id) tested_in_group
            from 
	            user join auth_assignment on user.user_id = auth_assignment.user_id
	            right join test_application on user.user_id = test_application.fk_id_user
            where group_id = ${group_id}
        `);
    }
}
