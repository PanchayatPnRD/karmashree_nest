import { Injectable } from '@nestjs/common';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { random } from 'lodash'; // Import the random function from lodash
@Injectable()
export class SchememasterService {
    constructor(
        @InjectRepository(MasterScheme)
        private  masterSchemeRepository: Repository<MasterScheme>,
        @InjectRepository(MasterSchemeExpenduture) private  MasterSchemeExpendutureRepository: Repository<MasterSchemeExpenduture>,
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        
    ) {}

    async create(createMasterSchemeDto: MasterSchemeDTO): Promise<MasterScheme> {
        // Create MasterScheme entity from DTO
        const masterScheme = this.masterSchemeRepository.create(createMasterSchemeDto);

        // Generate a random number (assuming lodash is available)
        const randomNum = random(1000, 9999); // Generates a random number between 1000 and 9999
        
        // Construct the schemeId using 'S', departmentNo, and the random number
        const schemeId = `S${createMasterSchemeDto.departmentNo}${randomNum}`;
        
        masterScheme.schemeId = schemeId; // Set the schemeId
        
        const savedMasterScheme = await this.masterSchemeRepository.save(masterScheme);
    
        // Create MasterSchemeExpenditure entity
        const masterSchemeExpenditure = new MasterSchemeExpenduture();
        masterSchemeExpenditure.schemeId = savedMasterScheme.scheme_sl; // Assuming there's a foreign key relationship between MasterScheme and MasterSchemeExpenditure
        masterSchemeExpenditure.schemeArea = savedMasterScheme.schemeArea;
        masterSchemeExpenditure.departmentNo = createMasterSchemeDto.departmentNo;
        masterSchemeExpenditure.districtcode = createMasterSchemeDto.districtcode;
        masterSchemeExpenditure.municipalityCode = createMasterSchemeDto.municipalityCode;
        masterSchemeExpenditure.blockcode = createMasterSchemeDto.blockcode;
        masterSchemeExpenditure.gpCode = createMasterSchemeDto.gpCode;
        masterSchemeExpenditure.sansadID = createMasterSchemeDto.sansadID;
        masterSchemeExpenditure.village = createMasterSchemeDto.village;
        masterSchemeExpenditure.schemeSector = createMasterSchemeDto.schemeSector;
        masterSchemeExpenditure.schemeSubsector = createMasterSchemeDto.schemeSubsector;
        masterSchemeExpenditure.schemeName = createMasterSchemeDto.schemeName;
        masterSchemeExpenditure.FundingDepttID = createMasterSchemeDto.FundingDepttID;
        masterSchemeExpenditure.FundingDeptname = createMasterSchemeDto.FundingDeptname;
        masterSchemeExpenditure.ExecutingDepttID = createMasterSchemeDto.ExecutingDepttID;
        masterSchemeExpenditure.ExecutingDeptName = createMasterSchemeDto.ExecutingDeptName;
        masterSchemeExpenditure.ImplementingAgencyID = createMasterSchemeDto.ImplementingAgencyID;
        masterSchemeExpenditure.ImplementingAgencyName = createMasterSchemeDto.ImplementingAgencyName;
        masterSchemeExpenditure.StatusOfWork = createMasterSchemeDto.StatusOfWork;
        masterSchemeExpenditure.tentativeStartDate = createMasterSchemeDto.tentativeStartDate;
        masterSchemeExpenditure.ActualtartDate = createMasterSchemeDto.ActualtartDate;
        masterSchemeExpenditure.ExpectedCompletionDate = createMasterSchemeDto.ExpectedCompletionDate;
        masterSchemeExpenditure.totalprojectCost = createMasterSchemeDto.totalprojectCost;
        masterSchemeExpenditure.totalWageCost = createMasterSchemeDto.totalWageCost;
        masterSchemeExpenditure.totalLabour = createMasterSchemeDto.totalLabour;
        masterSchemeExpenditure.personDaysGenerated = createMasterSchemeDto.personDaysGenerated;
        masterSchemeExpenditure.totalUnskilledWorkers = createMasterSchemeDto.totalUnskilledWorkers;
        masterSchemeExpenditure.totalSemiSkilledWorkers = createMasterSchemeDto.totalSemiSkilledWorkers;
        masterSchemeExpenditure.totalSkilledWorkers = createMasterSchemeDto.totalSkilledWorkers;
        masterSchemeExpenditure.ex1 = createMasterSchemeDto.ex1;
        masterSchemeExpenditure.ex2 = createMasterSchemeDto.ex2;
        masterSchemeExpenditure.ex3 = createMasterSchemeDto.ex3;
        masterSchemeExpenditure.ex4 = createMasterSchemeDto.ex4;
        masterSchemeExpenditure.ex5 = createMasterSchemeDto.ex5;
        masterSchemeExpenditure.userIndex = createMasterSchemeDto.userIndex;

        await this.MasterSchemeExpendutureRepository.save(masterSchemeExpenditure);
    
        
        return savedMasterScheme;
    }

    async findByUserIndex(userIndex: number): Promise<{ errorCode: number; result: MasterScheme[] }> {
        try {
            const masterSchemes = await this.masterSchemeRepository.find({ where: { userIndex } });

            return {
                errorCode: 0,
                result: masterSchemes,
            };
        } catch (error) {
            // Handle errors appropriately (logging, throwing custom exceptions, etc.)
            throw error;
        }
    }
    
}
