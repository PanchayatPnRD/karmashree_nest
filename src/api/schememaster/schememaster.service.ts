import { Injectable } from '@nestjs/common';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { random } from 'lodash'; // Import the random function from lodash
import { UpdateMasterSchemeDTO } from './dto/updateschem.dto';
import { DemandMaster } from 'src/entity/demandmaster.entity';
import { Employment } from 'src/entity/employment.entity';
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
        @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
        @InjectRepository(Employment)private  employment: Repository<Employment>,
    ) {}

    async create(createMasterSchemeDto: MasterSchemeDTO) {

        try{
        // Create MasterScheme entity from DTO
        const masterScheme = this.masterSchemeRepository.create(createMasterSchemeDto);

        // Generate a random number (assuming lodash is available)
        const randomNum = random(1000, 9999); // Generates a random number between 1000 and 9999
        
        // Construct the schemeId using 'S', departmentNo, and the random number
        const department = await this.getDepatmentbyid(createMasterSchemeDto.departmentNo);
        const departmentName = department.result?.deptshort || '';
        const schemeId = `KR-${departmentName}-${createMasterSchemeDto.districtcode}-${randomNum}`;
        
        masterScheme.schemeId = schemeId;

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
        masterSchemeExpenditure.totalWageCost = createMasterSchemeDto.totalwagescostinvoled;
        masterSchemeExpenditure.finYear = createMasterSchemeDto.finYear;
       
        
        
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
        const schemeid =  masterScheme.schemeId;
//result: savedMasterScheme
        return { errorCode: 0  ,message:"Scheme created successfully",schemeid };
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
    }

    async findByUserIndex(userIndex: number) {
        try {
            const masterSchemes = await this.masterSchemeRepository.find({ where: { userIndex },order: { scheme_sl: 'DESC' }  });

            return {
                errorCode: 0,
                result: masterSchemes,
            };
        } catch (error) {
            // Handle errors appropriately (logging, throwing custom exceptions, etc.)
            throw error;
        }
    }
    
    async getAllScheme(userIndex: number) {
        try {
          const schemes = await this.masterSchemeRepository.find({
            where: { userIndex },
            select: [
              'scheme_sl', 'schemeId', 'schemeName', 'finYear', 'village', 'ControctorID',
               'workorderNo', 'workOderDate','FundingDepttID',
               'FundingDeptname','ExecutingDepttID','ExecutingDeptName',
               'ImplementingAgencyID','ImplementingAgencyName',
               'personDaysGenerated',
               'totalUnskilledWorkers',
               'totalSemiSkilledWorkers',
               'totalSkilledWorkers',
               'schemeId',
               'schemeSector'

            ],
            order: { scheme_sl: 'DESC' }
          });
        


          const concatenatedScheme = schemes
            .filter(scheme => scheme.ControctorID !== 0)
            .filter(scheme => scheme.workorderNo !== "0")
          
             // Filter out schemes where ControctorID is null
            .map(scheme => {
              const Name = scheme.schemeName ? scheme.schemeName : '';
              const ControctorID = scheme.ControctorID ? scheme.ControctorID : '';
              const FundingDeptname = scheme.FundingDeptname ? scheme.FundingDeptname : '';

              const FundingDepttID = scheme.FundingDepttID ? scheme.FundingDepttID : '';
              const ExecutingDepttID = scheme.ExecutingDepttID ? scheme.ExecutingDepttID : '';
              const ExecutingDeptName = scheme.ExecutingDeptName ? scheme.ExecutingDeptName : '';
              const ImplementingAgencyID = scheme.ImplementingAgencyID ? scheme.ImplementingAgencyID : '';
              const ImplementingAgencyName = scheme.ImplementingAgencyName ? scheme.ImplementingAgencyName : '';
             
              const personDaysGenerated = scheme.personDaysGenerated ? scheme.personDaysGenerated : '';
              const totalUnskilledWorkers = scheme.totalUnskilledWorkers ? scheme.totalUnskilledWorkers : '';
              const totalSkilledWorkers = scheme.totalSkilledWorkers ? scheme.totalSkilledWorkers : '';
              const scheme_Id = scheme.schemeId ? scheme.schemeId : '';
              const schemeSector = scheme.schemeSector ? scheme.schemeSector : '';


              
             const totalSemiSkilledWorkers = scheme.totalSemiSkilledWorkers ? scheme.totalSemiSkilledWorkers : '';

              const village = scheme.village ? scheme.village : '';
              const schemeId = scheme.schemeId ? scheme.schemeId : '';
              const finYear = scheme.finYear ? [scheme.finYear] : []; // Wrap finYear in []
              const schemename = `${schemeId}-${Name}-[${finYear}]`;
      
              // Construct the result object
              const result = { 
                scheme_sl: scheme.scheme_sl, 
                schemename, 
                village, 
                ControctorID, 
                FundingDeptname ,
                FundingDepttID,
                ExecutingDepttID,
                ExecutingDeptName,

               personDaysGenerated,
                totalUnskilledWorkers,
               totalSkilledWorkers,
               totalSemiSkilledWorkers,
               ImplementingAgencyID,
              ImplementingAgencyName,
              scheme_Id,
              schemeSector
  
              };
      
              // Only include workOrderNo and workOderDate if they are present
              if (scheme.workorderNo) {
                result['workOrderNo'] = scheme.workorderNo;
              }
              if (scheme.workOderDate) {
                result['workOderDate'] = scheme.workOderDate;
              }
      
              return result;
            });
      
          return {
            errorCode: 0,
            result: concatenatedScheme,
          };
        } catch (error) {
          throw new Error('Failed to fetch schemes from the database.');
        }
      }
      
    
     

      async getschemeList(userIndex: number) {
          try {
              // Use QueryBuilder to fetch schemes
              const schemes = await this.masterSchemeRepository.createQueryBuilder('scheme')
                
                  .where('scheme.userIndex = :userIndex', { userIndex })
                  .orderBy('scheme.SubmitTime', 'DESC')
                  .addOrderBy('scheme.scheme_sl','DESC')
                  .getMany();
      
              if (!schemes || schemes.length === 0) {
                  return {
                      errorCode: 1,
                      message: 'Schemes not found for the provided user index',
                  };
              }
      
              const schemesWithDetails = [];
      
              await Promise.all(schemes.map(async (scheme) => {
                  try {
                      const districtDetails = await this.getAllDistricts(scheme.districtcode);
                      const districtName = districtDetails.result ? districtDetails.result.districtName : '';
      
                      const blockDetails = await this.getAllblock(scheme.blockcode);
                      const blockName = blockDetails.result ? blockDetails.result.blockName : '';
      
                      const gpDetails = await this.getAllgp(scheme.gpCode);
                      const gpName = gpDetails.result ? gpDetails.result.gpName : '';
      
                      const deptDetails = await this.getDepatmentbyid(scheme.departmentNo);
                      const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
      
                      const muniDetails = await this.getmunibyid(scheme.municipalityCode);
                      const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
      
                      schemesWithDetails.push({
                          ...scheme,
                          districtName: districtName,
                          blockName: blockName,
                          gpName: gpName,
                          deptName: deptName,
                          muniName: muniName,
                      });
                  } catch (error) {
                      // Log the error for this scheme
                      console.error(`Failed to fetch details for scheme with scheme_sl ${scheme.scheme_sl}:`, error);
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
  
 
        dept = await this.masterdepartment.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo","deptshort"] });
    
  
   
  
      return { errorCode: 0, result: dept };

     
    }
    async getContractor(cont_sl: number) {
      try {
        // Use `findOne` to retrieve a single record
        const contractor = await this.Contractor.findOne({ where: { cont_sl } });
    
        if (!contractor) {
          return {
            errorCode: 1,
            message: 'Contractor not found',
          };
        }
    
    
    
        return {
          errorCode: 0,
          result: contractor,
        };
      } catch (error) {
        throw new Error('Failed to fetch contractor from the database.');
      }
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

          async getSchemeById(scheme_sl: number) {
            try {
              // Find the MasterScheme by scheme_sl
              const masterScheme = await this.masterSchemeRepository.findOne({ where: { scheme_sl } });
              
              if (!masterScheme) {
                return { errorCode: 1, message: 'Master Scheme not found' };
              }
              
              // Get contractor details
              const conDetails = await this.getContractor(masterScheme.ControctorID);
        
            
              const result = await this.employment
              .createQueryBuilder('employment')
              .select([
                'master_scheme.scheme_sl',
                'employment.workerJobCardNo',
                'employment.workerName',
                'SUM(work_allocation.noOfDaysWorkDemanded) AS "NoOfDaysDemanded"',
                'SUM(work_allocation.noOfDaysWorkAlloted) AS "NoOfDaysAllocated"',
                'SUM(employment.noOfDaysWorProvided) AS "NoOfDaysProvided"',
                'SUM(employment.totalWagePaid) AS "TotalWagesPaid"',
                'SUM(employment.noOfDaysWorProvided) AS "MANDAYS"',
                '(SUM(employment.totalWagePaid) / SUM(employment.noOfDaysWorProvided)) AS "AVERAGEWAGE"',
              ])
              .innerJoin('master_scheme', 'master_scheme', 'master_scheme.scheme_sl = employment.schemeId')
              .innerJoin('work_allocation', 'work_allocation', 'master_scheme.scheme_sl = work_allocation.schemeId')
              .where('master_scheme.scheme_sl = :scheme_sl', { scheme_sl })
              .groupBy('master_scheme.scheme_sl, employment.workerJobCardNo, employment.workerName')
              .getRawMany();
          
        
              return {
                errorCode: 0,
                message: 'Scheme found successfully',
                masterScheme,
                contractorDetails: conDetails,
                employmentSummary: result,
              };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
            }
          }
          
          async updateMasterScheme(scheme_sl: number, updateMasterSchemeDto: UpdateMasterSchemeDTO) {
            try {
              // Find the existing MasterScheme by schemeId
              const existingMasterScheme = await this.masterSchemeRepository.findOne({ where: { scheme_sl } });
          
              if (!existingMasterScheme) {
                return { errorCode: 1, message: 'Master Scheme not found' };
              }
          
              // Update MasterScheme fields
              // existingMasterScheme.schemeArea = updateMasterSchemeDto.schemeArea;
              // existingMasterScheme.departmentNo = updateMasterSchemeDto.departmentNo;
              // existingMasterScheme.districtcode = updateMasterSchemeDto.districtcode;
              // existingMasterScheme.municipalityCode = updateMasterSchemeDto.municipalityCode;
              // existingMasterScheme.blockcode = updateMasterSchemeDto.blockcode;
              // existingMasterScheme.gpCode = updateMasterSchemeDto.gpCode;
              // existingMasterScheme.sansadID = updateMasterSchemeDto.sansadID;
              // existingMasterScheme.village = updateMasterSchemeDto.village;
              // existingMasterScheme.schemeSector = updateMasterSchemeDto.schemeSector;
              // existingMasterScheme.schemeSubsector = updateMasterSchemeDto.schemeSubsector;
              // existingMasterScheme.schemeName = updateMasterSchemeDto.schemeName;
              // existingMasterScheme.FundingDepttID = updateMasterSchemeDto.FundingDepttID;
              // existingMasterScheme.FundingDeptname = updateMasterSchemeDto.FundingDeptname;
              // existingMasterScheme.ExecutingDepttID = updateMasterSchemeDto.ExecutingDepttID;
              // existingMasterScheme.ExecutingDeptName = updateMasterSchemeDto.ExecutingDeptName;
              // existingMasterScheme.ImplementingAgencyID = updateMasterSchemeDto.ImplementingAgencyID;
              // existingMasterScheme.ImplementingAgencyName = updateMasterSchemeDto.ImplementingAgencyName;
          
              existingMasterScheme.totalprojectCost = updateMasterSchemeDto.totalprojectCost;
              existingMasterScheme.totalLabour = updateMasterSchemeDto.totalLabour;
              existingMasterScheme.personDaysGenerated = updateMasterSchemeDto.personDaysGenerated;
              existingMasterScheme.totalUnskilledWorkers = updateMasterSchemeDto.totalUnskilledWorkers;
              existingMasterScheme.totalSemiSkilledWorkers = updateMasterSchemeDto.totalSemiSkilledWorkers;
              existingMasterScheme.totalSkilledWorkers = updateMasterSchemeDto.totalSkilledWorkers;
           
              existingMasterScheme.StatusOfWork = updateMasterSchemeDto.StatusOfWork;
              existingMasterScheme.tentativeStartDate = updateMasterSchemeDto.tentativeStartDate;
              existingMasterScheme.ActualtartDate = updateMasterSchemeDto.ActualtartDate;
              existingMasterScheme.ExpectedCompletionDate = updateMasterSchemeDto.ExpectedCompletionDate;
              existingMasterScheme.Remarks = updateMasterSchemeDto.Remarks;
              existingMasterScheme.workorderNo = updateMasterSchemeDto.workorderNo;
              existingMasterScheme.workOderDate = updateMasterSchemeDto.workOderDate;
              existingMasterScheme.ControctorID = updateMasterSchemeDto.ControctorID;
           
  
  
          
          
              // Save the updated MasterScheme
              await this.masterSchemeRepository.save(existingMasterScheme);
          
              // Find the existing MasterSchemeExpenditure by schemeId
              const existingMasterSchemeExpenditure = await this.MasterSchemeExpendutureRepository.findOne({ where: { schemeId:scheme_sl } });
          
              if (!existingMasterSchemeExpenditure) {
                return { errorCode: 1, message: 'Master Scheme Expenditure not found' };
              }
          
              // Update MasterSchemeExpenditure fields
              existingMasterSchemeExpenditure.schemeArea = updateMasterSchemeDto.schemeArea;
              existingMasterSchemeExpenditure.departmentNo = updateMasterSchemeDto.departmentNo;
              existingMasterSchemeExpenditure.districtcode = updateMasterSchemeDto.districtcode;
              existingMasterSchemeExpenditure.municipalityCode = updateMasterSchemeDto.municipalityCode;
              existingMasterSchemeExpenditure.blockcode = updateMasterSchemeDto.blockcode;
              existingMasterSchemeExpenditure.gpCode = updateMasterSchemeDto.gpCode;
              existingMasterSchemeExpenditure.sansadID = updateMasterSchemeDto.sansadID;
              existingMasterSchemeExpenditure.village = updateMasterSchemeDto.village;
              existingMasterSchemeExpenditure.schemeSector = updateMasterSchemeDto.schemeSector;
              existingMasterSchemeExpenditure.schemeSubsector = updateMasterSchemeDto.schemeSubsector;
              existingMasterSchemeExpenditure.schemeName = updateMasterSchemeDto.schemeName;
              existingMasterSchemeExpenditure.FundingDepttID = updateMasterSchemeDto.FundingDepttID;
              existingMasterSchemeExpenditure.FundingDeptname = updateMasterSchemeDto.FundingDeptname;
              existingMasterSchemeExpenditure.ExecutingDepttID = updateMasterSchemeDto.ExecutingDepttID;
              existingMasterSchemeExpenditure.ExecutingDeptName = updateMasterSchemeDto.ExecutingDeptName;
              existingMasterSchemeExpenditure.ImplementingAgencyID = updateMasterSchemeDto.ImplementingAgencyID;
              existingMasterSchemeExpenditure.ImplementingAgencyName = updateMasterSchemeDto.ImplementingAgencyName;
              existingMasterSchemeExpenditure.StatusOfWork = updateMasterSchemeDto.StatusOfWork;
              existingMasterSchemeExpenditure.tentativeStartDate = updateMasterSchemeDto.tentativeStartDate;
              existingMasterSchemeExpenditure.ActualtartDate = updateMasterSchemeDto.ActualtartDate;
              existingMasterSchemeExpenditure.ExpectedCompletionDate = updateMasterSchemeDto.ExpectedCompletionDate;
              existingMasterSchemeExpenditure.totalprojectCost = updateMasterSchemeDto.totalprojectCost;
              existingMasterSchemeExpenditure.totalLabour = updateMasterSchemeDto.totalLabour;
              existingMasterSchemeExpenditure.personDaysGenerated = updateMasterSchemeDto.personDaysGenerated;
              existingMasterSchemeExpenditure.totalUnskilledWorkers = updateMasterSchemeDto.totalUnskilledWorkers;
              existingMasterSchemeExpenditure.totalSemiSkilledWorkers = updateMasterSchemeDto.totalSemiSkilledWorkers;
              existingMasterSchemeExpenditure.totalSkilledWorkers = updateMasterSchemeDto.totalSkilledWorkers;
            
          
              // Save the updated MasterSchemeExpenditure
              await this.MasterSchemeExpendutureRepository.save(existingMasterSchemeExpenditure);
          
              return { errorCode: 0, message: "Scheme and expenditure updated successfully" };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
            }
          }
        
          

          async getCounts() {
            try {
              // Count unique ExecutingDepttID
              const uniqueExecutingDepttIDCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.ExecutingDepttID)', 'count')
                .getRawOne();
        
              // Count unique departmentNo
              const uniqueDepartmentNoCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.departmentNo)', 'count')
                .getRawOne();
        
              // Count unique FundingDepttID
              const uniqueFundingDepttIDCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.FundingDepttID)', 'count')
                .getRawOne();

                const scheme = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.scheme_sl)', 'count')
                .getRawOne();
        
        
              // Sum of personDaysGenerated
              const totalPersonDaysGenerated = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('SUM(mse.personDaysGenerated)', 'total')
                .getRawOne();
        
              // Sum of totalUnskilledWorkers
              const totalUnskilledWorkers = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('SUM(mse.totalUnskilledWorkers)', 'total')
                .getRawOne();

                const totalAvgMandays = await this.demandMaster
                .createQueryBuilder('dm')
                .select('COUNT(DISTINCT dm.workerJobCardNo)', 'count')
                .getRawOne();
          
              // Sum the total cost provided
              const totalCostProvided = await this.masterSchemeRepository
                .createQueryBuilder('ms')
                .select('SUM(ms.totalCostprovided)', 'total')
                .getRawOne();


                const avgCostProvidedPerWorker = totalCostProvided.total / totalAvgMandays.count;




              
              // Calculate the average cost provided per worker
          
              const employmentDataForLast7Days = await this.getEmploymentDataForLast7Days();
              return {
                errorCode: 0,
                result: {
                  ExecutingDepttIDCount: uniqueExecutingDepttIDCount.count||0,
                  DepartmentNoCount: uniqueDepartmentNoCount.count||0,
                  FundingDepttIDCount: uniqueFundingDepttIDCount.count||0,
                  totalPersonDaysGenerated: totalPersonDaysGenerated.total||0,
                  totalUnskilledWorkers: totalUnskilledWorkers.total||0,
                  avgCostProvidedPerWorker:avgCostProvidedPerWorker||0,
                  totalscheme:scheme.count||0,
                  charts: employmentDataForLast7Days,
            
                },
              };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
            }
          }
        
          async getEmploymentDataForLast7Days() {
            try {
              const today = new Date();
              const last7Days = new Date(today);
              last7Days.setDate(today.getDate() - 6); // Including today
          
              // Generate an array of all dates within the last 7 days
              const dateArray = [];
              for (let i = 0; i < 7; i++) {
                const date = new Date(last7Days);
                date.setDate(last7Days.getDate() + i);
                dateArray.push(date);
              }
          
              // Query total mandays provided in the last 7 days
              const totalMandays = await this.employment
                .createQueryBuilder('e')
                .select('DATE(e.submitTime)', 'day')
                .addSelect('SUM(e.noOfDaysWorProvided)', 'totalMandays')
                .where('e.submitTime >= :last7Days', {
                  last7Days: last7Days.toISOString().slice(0, 19).replace('T', ' ')
                })
                .groupBy('day')
                .orderBy('day', 'ASC')
                .getRawMany();
          
              // Query total engaged workers in the last 7 days
              const totalEngaged = await this.employment
                .createQueryBuilder('e')
                .select('DATE(e.submitTime)', 'day')
                .addSelect('COUNT(DISTINCT e.workerJobCardNo)', 'totalEngaged')
                .where('e.submitTime >= :last7Days', {
                  last7Days: last7Days.toISOString().slice(0, 19).replace('T', ' ')
                })
                .groupBy('day')
                .orderBy('day', 'ASC')
                .getRawMany();
          
              // Create a mapping of dates with default values
              const dateMap = dateArray.reduce((map, date) => {
                const dateString = date.toISOString().slice(0, 10);
                const monthDay = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
                map[dateString] = {
                  month: monthDay,
                  engaged: 0,
                  mandays: 0
                };
                return map;
              }, {});
          
              // Merge totalMandays into the dateMap
              totalMandays.forEach(item => {
                const dateString = item.day.toISOString().slice(0, 10);
                if (dateMap[dateString]) {
                  dateMap[dateString].mandays = parseInt(item.totalMandays);
                }
              });
          
              // Merge totalEngaged into the dateMap
              totalEngaged.forEach(item => {
                const dateString = item.day.toISOString().slice(0, 10);
                if (dateMap[dateString]) {
                  dateMap[dateString].engaged = parseInt(item.totalEngaged);
                }
              });
          
              // Aggregate the results
              const result = Object.values(dateMap).map((data: any) => ({
                month: data.month,
                engaged: data.engaged > 0 ? data.engaged : 0,
                mandays: data.mandays > 0 ? data.mandays : 0
              }));
          
              return   result
             
            } catch (error) {
              return {
                errorCode: 1,
                message: 'Something went wrong: ' + error.message
              };
            }
          }
          
          

          
          async getactionplanreport() {
            try {
              // Count unique ExecutingDepttID
              const uniqueExecutingDepttIDCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.ExecutingDepttID)', 'count')
                .getRawOne();
        
              // Count unique departmentNo
              const uniqueDepartmentNoCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.departmentNo)', 'count')
                .getRawOne();
        
              // Count unique FundingDepttID
              const uniqueFundingDepttIDCount = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.FundingDepttID)', 'count')
                .getRawOne();

                const schemeSector = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('COUNT(DISTINCT mse.schemeSector)', 'count')
                .getRawOne();
        
                
              // Sum of personDaysGenerated
              const totalPersonDaysGenerated = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('SUM(mse.personDaysGenerated)', 'total')
                .getRawOne();
        
              // Sum of totalUnskilledWorkers
              const totalUnskilledWorkers = await this.masterSchemeRepository
                .createQueryBuilder('mse')
                .select('SUM(mse.totalUnskilledWorkers)', 'total')
                .getRawOne();

                const totalAvgMandays = await this.demandMaster
                .createQueryBuilder('dm')
                .select('COUNT(DISTINCT dm.workerJobCardNo)', 'count')
                .getRawOne();
          
              // Sum the total cost provided
              const totalCostProvided = await this.masterSchemeRepository
                .createQueryBuilder('ms')
                .select('SUM(ms.totalCostprovided)', 'total')
                .getRawOne();
          
              // Calculate the average cost provided per worker
              const avgCostProvidedPerWorker = totalCostProvided.total / totalAvgMandays.count;
           
           
              return {
                errorCode: 0,
                result: [
                  {
                  ExecutingDepttIDCount: uniqueExecutingDepttIDCount.count,
                  DepartmentNoCount: uniqueDepartmentNoCount.count,
                  FundingDepttIDCount: uniqueFundingDepttIDCount.count,
                  totalPersonDaysGenerated: totalPersonDaysGenerated.total,
                  totalUnskilledWorkers: totalUnskilledWorkers.total,
                  avgCostProvidedPerWorker:avgCostProvidedPerWorker,
                  schemeSector:schemeSector.total

                  }
                ],
              };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
            }
          }

        
          async Summary_Report_on_Annual_Action_Plan() {
            try {
              const stats = await this.masterSchemeRepository
                .createQueryBuilder('master_scheme')
                .select([
                  'COUNT(DISTINCT master_scheme.ImplementingAgencyID) AS totalImplementingDepartments',
                  'COUNT(DISTINCT master_scheme.ExecutingDepttID) AS totalPIAs',
                  'COUNT(DISTINCT master_scheme.blockcode) AS totalBlocksInvolved',
                  'COUNT(DISTINCT master_scheme.schemeSector) AS totalSectors',
                  'COUNT(master_scheme.schemeId) AS totalSchemesEntered',
                  'COUNT(master_scheme.workorderNo != \'\' AND master_scheme.ControctorID != 0) AS totalSchemesWithWorkOrderIssued',
                  'SUM(CASE WHEN (master_scheme.workorderNo != \'\' AND master_scheme.ControctorID != 0) THEN master_scheme.totalprojectCost END) AS totalProjectCost',
                  'SUM(CASE WHEN (master_scheme.workorderNo != \'\' AND master_scheme.ControctorID != 0) THEN master_scheme.totalLabour END) AS totalUnskilledWorkers',
                  'SUM(CASE WHEN (master_scheme.workorderNo != \'\' AND master_scheme.ControctorID != 0) THEN master_scheme_expenduture.totalWageCost END) AS totalWageCost',
                  'SUM(CASE WHEN (master_scheme.workorderNo != \'\' AND master_scheme.ControctorID != 0) THEN master_scheme_expenduture.personDaysGenerated END) AS totalMandays'
                ])
                .innerJoin(
                  MasterSchemeExpenduture,
                  'master_scheme_expenduture',
                  'master_scheme.scheme_sl = master_scheme_expenduture.schemeId'
                )
                .getRawOne();
        
              return { errorCode: 0, result: stats };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong: ' + error.message };
            }
          }


          async Summary_Report_on_Schemes() {
            try {
              const result = await this.masterSchemeRepository
                .createQueryBuilder('master_scheme')
                .select([
                  "COUNT(DISTINCT master_scheme.ImplementingAgencyID) AS 'Total No of Implementing Departments'",
                  "COUNT(DISTINCT master_scheme.ExecutingDepttID) AS 'Total No of PIAs'",
                  "COUNT(DISTINCT master_scheme.blockcode) AS 'Total Blocks involved'",
                  "COUNT(DISTINCT master_scheme.schemeSector) AS 'Total No of Sectors'",
                  "COUNT(master_scheme.schemeId) AS 'Total No of Schemes entered'",
                  "COUNT(CASE WHEN master_scheme.workorderNo != '' AND master_scheme.ControctorID != 0 THEN 1 END) AS 'Total No of Schemes for which Work Order issued'",
                  "SUM(CASE WHEN master_scheme.workorderNo != '' AND master_scheme.ControctorID != 0 THEN master_scheme.totalprojectCost ELSE 0 END) AS 'Total Project Cost for which WO issued'",
                  "SUM(CASE WHEN master_scheme.workorderNo != '' AND master_scheme.ControctorID != 0 THEN master_scheme.totalLabour ELSE 0 END) AS 'Total Unskilled Workers for which WO issued'",
                  "SUM(CASE WHEN master_scheme.workorderNo != '' AND master_scheme.ControctorID != 0 THEN master_scheme_expenduture.totalWageCost ELSE 0 END) AS 'Total Wage Cost for which WO issued'",
                  "SUM(CASE WHEN master_scheme.workorderNo != '' AND master_scheme.ControctorID != 0 THEN master_scheme_expenduture.personDaysGenerated ELSE 0 END) AS 'Total Mandays for which WO issued'"
                ])
                .innerJoin(MasterSchemeExpenduture, 'master_scheme_expenduture', 'master_scheme.scheme_sl = master_scheme_expenduture.schemeId')
                .getRawOne();
        
              return { errorCode: 0, result: result };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong: ' + error.message };
            }
          }


          async getSummaryReportHome() {
            try {
              const result = await this.masterSchemeRepository
                .createQueryBuilder('master_scheme')
                .select([
                  "COUNT(DISTINCT master_scheme.schemeSector) AS 'Total Of Sectors'",
                  "COUNT(DISTINCT master_scheme.FundingDepttID) AS 'Total No Of Funding'",
                  "COUNT(master_scheme.schemeId) AS 'Total No Of Schemes'",
                  "SUM(master_scheme.totalprojectCost) AS 'Total Project Cost'",
                  "SUM(master_scheme_expenduture.totalWageCost) AS 'Total Amount Spent'",
                  "SUM(master_scheme_expenduture.totalLabour) AS 'Total No Of Workers'"
                ])
                .innerJoin(MasterSchemeExpenduture, 'master_scheme_expenduture', 'master_scheme.scheme_sl = master_scheme_expenduture.schemeId')
                .getRawOne();
        
              return { errorCode: 0, result: result };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong: ' + error.message };
            }
          }


          async getFundingDepartmentWiseReport() {
            try {
              const result = await this.masterdepartment
              .createQueryBuilder('masterdepartment')
              .leftJoin('master_scheme', 'master_scheme', 'masterdepartment.departmentNo = master_scheme.FundingDepttID')
              .leftJoin('master_scheme_expenduture', 'master_scheme_expenduture', 'master_scheme.scheme_sl = master_scheme_expenduture.schemeId AND masterdepartment.departmentNo = master_scheme_expenduture.FundingDepttID')
              .select([
                "masterdepartment.departmentName AS departmentName",
                "masterdepartment.departmentNo AS departmentCode",
                "COUNT(master_scheme.schemeId) AS Total_scheme",
                "COUNT(master_scheme.schemeSector) AS Total_sector",
                "SUM(master_scheme.totalprojectCost) AS Total_Cost",
                "SUM(master_scheme_expenduture.totalWageCost) AS Total_Spent",
                "SUM(master_scheme_expenduture.totalUnskilledWorkers) AS Total_worker",
                "SUM(master_scheme_expenduture.personDaysGenerated) AS Total_Mandays",
              ])
              .groupBy('masterdepartment.departmentName, masterdepartment.departmentNo')
              .orderBy('masterdepartment.departmentName', 'ASC')
              .getRawMany();
            
              
              return { errorCode: 0, result: result };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong: ' + error.message };
            }
          }
}
