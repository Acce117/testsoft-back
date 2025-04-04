import { Injectable } from '@nestjs/common';
import { BelbinGeneralResults } from '../models/BelbinGeneralResults.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
}
