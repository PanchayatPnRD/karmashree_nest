import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { Repository } from 'typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';

import { random } from 'lodash'; // Import the random function from lodash
import { MasterWorkerRequirementDto } from './dto/worker.dto';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { Contractor_master } from 'src/entity/contractor.entity';
@Injectable()
export class WorkerrequisitionService {
    constructor(
        @InjectRepository(MasterWorkerRequirement) private masterWorkerRequirement: Repository<MasterWorkerRequirement>,
        @InjectRepository(MasterWorkerRequirement_allotment) private masterWorkerRequirementallotment: Repository<MasterWorkerRequirement_allotment>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(mastersector) private mastersector: Repository<mastersector>,
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        @InjectRepository(MasterScheme)
        private  masterSchemeRepository: Repository<MasterScheme>,
        @InjectRepository(MasterSchemeExpenduture) private  MasterSchemeExpendutureRepository: Repository<MasterSchemeExpenduture>,
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        
    ) {}

    async create(createWorkerRequirementDto: MasterWorkerRequirementDto) {
      try {
        // Create a new MasterWorkerRequirement entity
        const masterWorker = this.masterWorkerRequirement.create(createWorkerRequirementDto);
    
        // Generate a random workerreqID
        const randomNum = this.generateEMPID();
        masterWorker.workerreqID = randomNum;
    
        // Save the MasterWorkerRequirement entity
        const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
    
        // Create an array to store MasterWorkerRequirement_allotment entities
        const masterAllotment: MasterWorkerRequirement_allotment[] = [];
    
        // Extract gpCode from masterWorker
        const gpCode = masterWorker.gpCode;

        const workCodeSchemeID= masterWorker.workCodeSchemeID;
        const contractorID= masterWorker.ContractorID;
       const  currentMonthWork= masterWorker.currentMonth;
       
      //  const currentYear = masteDrWorker.currentYear;
    
        // Iterate through createworkalloDto array and create MasterWorkerRequirement_allotment entities
        for (const createWorkAllotDto of createWorkerRequirementDto.createworkalloDto) {
          const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
            workerreqID: savedMasterScheme.workerreqID,
            skilledWorkers: createWorkAllotDto.skilledWorkers,
            unskilledWorkers: createWorkAllotDto.unskilledWorkers,
            semiSkilledWorkers: createWorkAllotDto.semiSkilledWorkers,
            dateofwork: createWorkAllotDto.dateofwork,
            FundingDeptname:masterWorker.FundingDeptname,
            gpCode: gpCode, 
            workCodeSchemeID: workCodeSchemeID,
            contractorID: contractorID,
            currentMonthWork: currentMonthWork,
            departmentNo: masterWorker.departmentNo,
            districtcode: masterWorker.districtcode,
            municipalityCode: masterWorker.municipalityCode,
            blockcode: masterWorker.blockcode,
            currentYearWork: masterWorker.currentYear,
            userIndex:masterWorker.userIndex,
            schemeArea:masterWorker.schemeArea,
            finYearWork:masterWorker.finYear,
         
  contactPersonName: masterWorker.contactPersonName,


 
  contactPersonPhoneNumber:masterWorker.contactPersonPhoneNumber

           // finYearWork: masterWorker.finYearWork

          });
    
          // Save the MasterWorkerRequirement_allotment entity
          await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment); // Saving single entity
    
          // Push the saved entity to the masterAllotment array
          masterAllotment.push(newMasterWorkerAllotment); // Pushing single entity
        }
    const requireid =  masterWorker.workerreqID;
        // Return success response with created MasterWorkerRequirement_allotment entities
        return { errorCode: 0, message: "Worker Requisition created successfully", requireid };
      } catch (error) {
        // Return error response if any error occurs
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
    }
    
    
    
    
    private generateEMPID(): string {
      const random6Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
      return `REQ${random6Digits}`;
    }
    

      async getallwork(districtcode: number, blockcode?: number) {
        try {
          let work;
    
          if (blockcode) {
            work = await this.masterWorkerRequirement.find({ where: { districtcode, blockcode } });
          } else {
            work = await this.masterWorkerRequirement.find({ where: { districtcode } });
          }
    
          return { errorCode: 0, result: work };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }
    //   async getallrequztion(userIndex:number) {
    //     try {
    //         // Find worker requirements by user index
    //         const workRequirements = await this.masterWorkerRequirement.find({ where: { userIndex },order: { workersl: 'DESC' }  });
    
    //         if (!workRequirements || workRequirements.length === 0) {
    //             return {
    //                 errorCode: 1,
    //                 message: 'Worker requirements not found for the provided user index',
    //             };
    //         }
    
    //         // Array to store worker requirements with additional details
    //         const workRequirementsWithDetails = [];
    
    //         for (const workRequirement of workRequirements) {
    //             // Fetch additional details for each worker requirement
    //             const districtDetails = await this.getAllDistricts(workRequirement.districtcode);
    //             const districtName = districtDetails.result ? districtDetails.result.districtName : '';
               
    //             const blockDetails = await this.getAllblock(workRequirement.blockcode);
    //             const blockName = blockDetails.result ? blockDetails.result.blockName : '';
                
    //             const gpDetails = await this.getAllgp(workRequirement.gpCode);
    //             const gpName = gpDetails.result ? gpDetails.result.gpName : '';
         
    //             const deptDetails = await this.getDepatmentbyid(workRequirement.departmentNo);
    //             const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
    
    //             // const sectorDetails = await this.getSectorbyid(workRequirement.schemeSector);
    //             // const sectorName = sectorDetails.result ? sectorDetails.result.sectorName : '';
    
    //             const muniDetails = await this.getmunibyid(workRequirement.municipalityCode);
    //             const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
               
              
    //             // Convert workRequirement.pedastal to an integer
    //             const sechDetails = await this.getschemeid(workRequirement.workCodeSchemeID);
    //             const schName = sechDetails.result ? sechDetails.result.schemeName : '';
                
    //             // Fetch block details
    //             const conDetails = await this.getsconid(workRequirement.ContractorID);
    //             const conName = conDetails.result ? conDetails.result.contractorName : '';
    
    //             // Push worker requirement with details into the array
    //             workRequirementsWithDetails.push({
    //                 ...workRequirement,
    //                 districtName: districtName,
    //                 blockName: blockName,
    //                 gpName: gpName,
    //                 deptName: deptName,
    //                 // sectorName: sectorName,
    //                 muniName: muniName,
    //                 schName:schName,
    //                 conName:conName
                   
    //             });
    //         }
    
    //         // Return the array of worker requirements with details
    //         return {
    //             errorCode: 0,
    //             result: workRequirementsWithDetails,
    //         };
    //     } catch (error) {
    //         return {
    //             errorCode: 1,
    //             message: 'Failed to retrieve worker requirements: ' + error.message,
    //         };
    //     }
    // }
    async getallrequztion(userIndex: number) {
      try {
          // Find worker requirements by user index
          const workRequirements = await this.masterWorkerRequirement.find({
              where: { userIndex },
              order: { workersl: 'DESC' }
          });
  
          if (!workRequirements || workRequirements.length === 0) {
              return {
                  errorCode: 1,
                  message: 'Worker requirements not found for the provided user index',
              };
          }
  
          // Get aggregated worker counts grouped by workerreqID
          const aggregatedWorkerCounts = await this.masterWorkerRequirementallotment.createQueryBuilder('requirement')
              .select('requirement.workerreqID', 'workerreqID')
              .addSelect('SUM(requirement.unskilledWorkers)', 'totalUnskilledWorkers')
              .addSelect('SUM(requirement.semiSkilledWorkers)', 'totalSemiSkilledWorkers')
              .addSelect('SUM(requirement.skilledWorkers)', 'totalSkilledWorkers')
              .where('requirement.userIndex = :userIndex', { userIndex })
              .groupBy('requirement.workerreqID')
              .getRawMany();
  
          // Map aggregated counts to a dictionary for quick lookup
          const workerCountsMap = {};
          aggregatedWorkerCounts.forEach(count => {
              workerCountsMap[count.workerreqID] = {
                  totalUnskilledWorkers: parseInt(count.totalUnskilledWorkers, 10),
                  totalSemiSkilledWorkers: parseInt(count.totalSemiSkilledWorkers, 10),
                  totalSkilledWorkers: parseInt(count.totalSkilledWorkers, 10),
              };
          });
  
          // Array to store worker requirements with additional details
          const workRequirementsWithDetails = [];
  
          for (const workRequirement of workRequirements) {
              // Fetch additional details for each worker requirement
              const districtDetails = await this.getAllDistricts(workRequirement.districtcode);
              const districtName = districtDetails.result ? districtDetails.result.districtName : '';
  
              const blockDetails = await this.getAllblock(workRequirement.blockcode);
              const blockName = blockDetails.result ? blockDetails.result.blockName : '';
  
              const gpDetails = await this.getAllgp(workRequirement.gpCode);
              const gpName = gpDetails.result ? gpDetails.result.gpName : '';
  
              const deptDetails = await this.getDepatmentbyid(workRequirement.departmentNo);
              const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
  
              const muniDetails = await this.getmunibyid(workRequirement.municipalityCode);
              const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

              // const sectorDetails = await this.getSectorbyid(schemeSector);
              // const sectorName = sectorDetails.result ? sectorDetails.result.sectorname : '';
  
              const sechDetails = await this.getschemeid(workRequirement.workCodeSchemeID);
              const schName = sechDetails.result ? sechDetails.result.schemeName : '';
              const schemeId = sechDetails.result ? sechDetails.result.schemeId : '';
              const personDaysGenerated = sechDetails.result ? sechDetails.result.personDaysGenerated : '';

              const workorderNo = sechDetails.result ? sechDetails.result.workorderNo : '';
              const totalprojectCost = sechDetails.result ? sechDetails.result.totalprojectCost : '';
              const ExecutingDeptName = sechDetails.result ? sechDetails.result.ExecutingDeptName : '';
              const schemeSector = sechDetails.result ? sechDetails.result.schemeSector : '';
              const conDetails = await this.getsconid(workRequirement.ContractorID);
              const conName = conDetails.result ? conDetails.result.contractorName : '';
  
              // Get aggregated worker counts for the current worker requirement
              const workerCounts = workerCountsMap[workRequirement.workerreqID] || {
                  totalUnskilledWorkers: 0,
                  totalSemiSkilledWorkers: 0,
                  totalSkilledWorkers: 0,
              };
  
              // Push worker requirement with details into the array
              workRequirementsWithDetails.push({
                  ...workRequirement,
                  districtName: districtName,
                  blockName: blockName,
                  gpName: gpName,
                  deptName: deptName,
                  muniName: muniName,
                  schName: schName,
                  conName: conName,
                  scheme_Id:schemeId,
                  schemeSector:schemeSector,
                 personDaysGenerated:personDaysGenerated,
    
                 workorderNo:workorderNo,
                 totalprojectCost:totalprojectCost,
                 ExecutingDeptName:ExecutingDeptName,


                  totalUnskilledWorkers: workerCounts.totalUnskilledWorkers,
                  totalSemiSkilledWorkers: workerCounts.totalSemiSkilledWorkers,
                  totalSkilledWorkers: workerCounts.totalSkilledWorkers,
              });
          }
  
          // Return the array of worker requirements with details
          return {
              errorCode: 0,
              result: workRequirementsWithDetails,
          };
      } catch (error) {
          return {
              errorCode: 1,
              message: 'Failed to retrieve worker requirements: ' + error.message,
          };
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
      async getSectorbyid(sectorid: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.mastersector.findOne({ where: { sectorid },  select: ["sectorname","sectorid"] });
        
      
       
      
          return { errorCode: 0, result: dept };
    
         
        }
      async getschemeid(scheme_sl: number) {
        let dept; // Declare dept before the try block
      
      
            dept = await this.masterSchemeRepository.findOne({ where: { scheme_sl },  select: ["schemeName","scheme_sl","schemeId","personDaysGenerated","workorderNo","totalprojectCost","ExecutingDeptName","schemeSector"] });
        
      
       
      
          return { errorCode: 0, result: dept };
      
         
        }
        async getsconid(cont_sl: number) {
          let dept; // Declare dept before the try block
        
        
              dept = await this.Contractor.findOne({ where: { cont_sl },  select: ["contractorName","cont_sl"] });
          
        
         
        
            return { errorCode: 0, result: dept };
        
           
          }

        
    }
