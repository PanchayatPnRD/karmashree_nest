import { Injectable } from '@nestjs/common';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
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
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        
    ) {}

    async create(createMasterSchemeDto: MasterSchemeDTO) {

        try{
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

//result: savedMasterScheme
        return { errorCode: 0  ,message:"Scheme created successfully" };
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
    }

    async findByUserIndex(userIndex: number) {
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
    
    async getAllScheme() {
        try {
            const schemes = await this.masterSchemeRepository.find({ select: ['scheme_sl','schemeId', 'schemeName', 'finYear'] });
    
            const concatenatedScheme = schemes.map(scheme => {
                const Name = scheme.schemeName ? scheme.schemeName : '';
                const schemeId = scheme.schemeId ? scheme.schemeId : '';
                const finYear = scheme.finYear ? [scheme.finYear] : []; // Wrap finYear in []
    
                const schemename = `${schemeId}-${Name}-[${finYear}]`;
    
                return { scheme_sl: scheme.scheme_sl, schemename };
            });
    
            return {
                errorCode: 0,
                result: concatenatedScheme,
            };
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }
    
    async getschemeList(userIndex: number) {
        try {
            const scheme = await this.masterSchemeRepository.find({ where: { userIndex },  order: { scheme_sl: 'DESC' }  });
    
            if (!scheme || scheme.length === 0) {
                return {
                    errorCode: 1,
                    message: 'Contractors not found for the provided user index',
                };
            }
    
            const schemesWithDetails = [];
    
            await Promise.all(scheme.map(async (scheme) => {
                try {
                    const districtDetails = await this.getAllDistricts(scheme.districtcode);
                    const districtName = districtDetails.result ? districtDetails.result.districtName : '';
    
                    const blockDetails = await this.getAllblock(scheme.blockcode);
                    const blockname = blockDetails.result ? blockDetails.result.blockName : '';
    
                    const gpDetails = await this.getAllgp(scheme.gpCode);
                    const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
                    const deptDetails = await this.getDepatmentbyid(scheme.departmentNo);
                    const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

                    const muniDetails = await this.getmunibyid(scheme.municipalityCode);
                    const muniName = muniDetails.result ? muniDetails.result.urbanCode : '';



                    schemesWithDetails.push({
                        ...scheme,
                        districtName: districtName,
                        blockname: blockname,
                        gpName: gpName,
                        deptName: deptName,
                        muniName: muniName,
                    });
                } catch (error) {
                    // Log the error for this scheme
                    console.error(`Failed to fetch details for scheme`);
                }
            }));
    
            return {
                errorCode: 0,
                result: schemesWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch schemes from the database:', error);
            throw new Error('Failed to fetch schemes from the database.');
        }
    }

    async getAllDistricts(districtCode: number) {
        try {
            let districtDetails;
    
            if (!districtCode || districtCode === 0) {
                // Handle the case when districtCode is empty or '0', if needed
                return { errorCode: 1, message: 'Invalid districtCode' };
            } else {
                districtDetails = await this.masterzp.findOne({ 
                    where: { districtCode }, 
                    select: ["districtName","districtCode"]
                });
            }
    
            return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong while retrieving district details: " + error.message
            };
        }
    }
    
    async getAllsub(subdivCode: number) {
      try {
          let districtDetails;
    
          if (!subdivCode || subdivCode === 0) {
              // Handle the case when districtCode is empty or '0', if needed
              return { errorCode: 1, message: 'Invalid districtCode' };
          } else {
              districtDetails = await this.subdivision.findOne({ 
                  where: { subdivCode }, 
                  select: ["subdivName","subdivCode"]
              });
          }
    
          return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
      } catch (error) {
          return {
              errorCode: 1,
              message: "Something went wrong while retrieving district details: " + error.message
          };
      }
    }
    async getAllblock(blockCode: number) {
    try {
        let districtDetails;
    
        if (!blockCode || blockCode === 0) {
            // Handle the case when districtCode is empty or '0', if needed
            return { errorCode: 1, message: 'Invalid districtCode' };
        } else {
            districtDetails = await this.masterps.findOne({ 
                where: { blockCode }, 
                select: ["blockName","blockCode"]
            });
        }
    
        return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
    } catch (error) {
        return {
            errorCode: 1,
            message: "Something went wrong while retrieving district details: " + error.message
        };
    }
    }
    
    async getAllgp(gpCode: number) {
    try {
      let districtDetails;
    
      if (!gpCode || gpCode === 0) {
          // Handle the case when districtCode is empty or '0', if needed
          return { errorCode: 1, message: 'Invalid districtCode' };
      } else {
          districtDetails = await this.grampanchayat.findOne({ 
              where: { gpCode }, 
              select: ["gpName","gpCode"],
          });
      }
    
      return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
    } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong while retrieving district details: " + error.message
      };
    }
    }

    
  async getDepatmentbyid(departmentNo: number) {
    let dept; // Declare dept before the try block
  
 
        dept = await this.masterdepartment.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo"] });
    
  
   
  
      return { errorCode: 0, result: dept };

     
    }

    async getmunibyid(urbanCode: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.masterurban.findOne({ where: { urbanCode },  select: ["urbanName","urbanCode"] });

          return { errorCode: 0, result: dept };

        }

        async getschmeforallocation(blockcode: number, gpCode?: number) {
            try {
              let work;
        
              if (blockcode) {
                work = await this.masterSchemeRepository.find({ where: { blockcode, gpCode } });
              } else {
                work = await this.masterSchemeRepository.find({ where: { blockcode } });
              }
        
              return { errorCode: 0, result: work };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
            }
          }
}
