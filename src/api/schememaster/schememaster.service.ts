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
      
        // Generate the work allocation ID using the department name
       
        
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
              'scheme_sl', 'schemeId', 'schemeName', 'finYear', 'village', 'ControctorID', 'FundingDeptname', 'workorderNo', 'workOderDate'
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
                FundingDeptname 
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
              // Find the MasterScheme by schemeId
              const masterScheme = await this.masterSchemeRepository.findOne({ where: { scheme_sl } });
              
              if (!masterScheme) {
                return { errorCode: 1, message: 'Master Scheme not found' };
              }
          
              // Find the MasterSchemeExpenditure by schemeId
            
              return {
                errorCode: 0,
                message: 'Scheme found successfully',
                masterScheme,
           
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
              existingMasterScheme.schemeArea = updateMasterSchemeDto.schemeArea;
              existingMasterScheme.departmentNo = updateMasterSchemeDto.departmentNo;
              existingMasterScheme.districtcode = updateMasterSchemeDto.districtcode;
              existingMasterScheme.municipalityCode = updateMasterSchemeDto.municipalityCode;
              existingMasterScheme.blockcode = updateMasterSchemeDto.blockcode;
              existingMasterScheme.gpCode = updateMasterSchemeDto.gpCode;
              existingMasterScheme.sansadID = updateMasterSchemeDto.sansadID;
              existingMasterScheme.village = updateMasterSchemeDto.village;
              existingMasterScheme.schemeSector = updateMasterSchemeDto.schemeSector;
              existingMasterScheme.schemeSubsector = updateMasterSchemeDto.schemeSubsector;
              existingMasterScheme.schemeName = updateMasterSchemeDto.schemeName;
              existingMasterScheme.FundingDepttID = updateMasterSchemeDto.FundingDepttID;
              existingMasterScheme.FundingDeptname = updateMasterSchemeDto.FundingDeptname;
              existingMasterScheme.ExecutingDepttID = updateMasterSchemeDto.ExecutingDepttID;
              existingMasterScheme.ExecutingDeptName = updateMasterSchemeDto.ExecutingDeptName;
              existingMasterScheme.ImplementingAgencyID = updateMasterSchemeDto.ImplementingAgencyID;
              existingMasterScheme.ImplementingAgencyName = updateMasterSchemeDto.ImplementingAgencyName;
              existingMasterScheme.StatusOfWork = updateMasterSchemeDto.StatusOfWork;
              existingMasterScheme.tentativeStartDate = updateMasterSchemeDto.tentativeStartDate;
              existingMasterScheme.ActualtartDate = updateMasterSchemeDto.ActualtartDate;
              existingMasterScheme.ExpectedCompletionDate = updateMasterSchemeDto.ExpectedCompletionDate;
              existingMasterScheme.totalprojectCost = updateMasterSchemeDto.totalprojectCost;
              existingMasterScheme.totalLabour = updateMasterSchemeDto.totalLabour;
              existingMasterScheme.personDaysGenerated = updateMasterSchemeDto.personDaysGenerated;
              existingMasterScheme.totalUnskilledWorkers = updateMasterSchemeDto.totalUnskilledWorkers;
              existingMasterScheme.totalSemiSkilledWorkers = updateMasterSchemeDto.totalSemiSkilledWorkers;
              existingMasterScheme.totalSkilledWorkers = updateMasterSchemeDto.totalSkilledWorkers;
           
          
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
              const dummyData = [
                { month: "June 2024", engaged: 5, mandays: 6 },
                { month: "May 2024", engaged: 0, mandays: 0 },
                { month: "April 2024", engaged: 15, mandays: 11 },
                { month: "March 2024", engaged: 0, mandays: 0 },
                { month: "February 2024", engaged: 45, mandays: 1 },
                { month: "January 2024", engaged: 0, mandays: 8 },
             
                // Add more dummy data as needed
              ];
              return {
                errorCode: 0,
                result: {
                  ExecutingDepttIDCount: uniqueExecutingDepttIDCount.count,
                  DepartmentNoCount: uniqueDepartmentNoCount.count,
                  FundingDepttIDCount: uniqueFundingDepttIDCount.count,
                  totalPersonDaysGenerated: totalPersonDaysGenerated.total,
                  totalUnskilledWorkers: totalUnskilledWorkers.total,
                  avgCostProvidedPerWorker:avgCostProvidedPerWorker,
                  charts:dummyData
            
                },
              };
            } catch (error) {
              return { errorCode: 1, message: 'Something went wrong', error: error.message };
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
}
