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
          const randomNum = this.generateRandomNumber();
          masterWorker.workerreqID = randomNum;
      
          // Save the MasterWorkerRequirement entity
          const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
      
          // Create an array to store MasterWorkerRequirement_allotment entities
          const masterAllotment: MasterWorkerRequirement_allotment[] = [];
      
          // Iterate through createworkalloDto array and create MasterWorkerRequirement_allotment entities
          for (const createWorkAllotDto of createWorkerRequirementDto.createworkalloDto) {
            const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
              workerreqID: masterWorker.workerreqID,
              skilledWorkers: createWorkAllotDto.skilledWorkers,
              unskilledWorkers: createWorkAllotDto.unskilledWorkers,
              semiSkilledWorkers: createWorkAllotDto.semiSkilledWorkers,
              dateofwork: createWorkAllotDto.dateofwork,
              // departmentNo: MasterWorkerRequirementDto.departmentno,
              // districtcode: MasterWorkerRequirementDto.districtcode,
              // municipalityCode: MasterWorkerRequirementDto.municipalityCode,
              // blockcode: MasterWorkerRequirementDto.blockcode,
              // gpCode: MasterWorkerRequirementDto.gpCode,
              // workCodeSchemeID: MasterWorkerRequirementDto.workCodeSchemeID,
              // contractorID: MasterWorkerRequirementDto.contractorID,
              // currentMonthWork: MasterWorkerRequirementDto.currentMonthWork,
              // currentYearWork: MasterWorkerRequirementDto.currentYearWork,
              // finYearWork: MasterWorkerRequirementDto.finYearWork

            });
      
            // Save the MasterWorkerRequirement_allotment entity
            const createdMasterWorkerAllotment = await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment);
      
            // Push the saved entity to the masterAllotment array
            masterAllotment.push(createdMasterWorkerAllotment);
          }
      
          // Return success response with created MasterWorkerRequirement_allotment entities
          return { errorCode: 0, message: "Worker Requisition created successfully", masterAllotment };
        } catch (error) {
          // Return error response if any error occurs
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }
      
      private generateRandomNumber(): number {
        return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
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
      async getallrequztion(userIndex:number) {
        try {
            // Find worker requirements by user index
            const workRequirements = await this.masterWorkerRequirement.find({ where: { userIndex } });
    
            if (!workRequirements || workRequirements.length === 0) {
                return {
                    errorCode: 1,
                    message: 'Worker requirements not found for the provided user index',
                };
            }
    
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
    
                // const sectorDetails = await this.getSectorbyid(workRequirement.schemeSector);
                // const sectorName = sectorDetails.result ? sectorDetails.result.sectorName : '';
    
                const muniDetails = await this.getmunibyid(workRequirement.municipalityCode);
                const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
               
              
                // Convert workRequirement.pedastal to an integer
                const sechDetails = await this.getschemeid(workRequirement.workCodeSchemeID);
                const schName = sechDetails.result ? sechDetails.result.schemeName : '';
                
                // Fetch block details
                const conDetails = await this.getsconid(workRequirement.ContractorID);
                const conName = conDetails.result ? conDetails.result.contractorName : '';
    
                // Push worker requirement with details into the array
                workRequirementsWithDetails.push({
                    ...workRequirement,
                    districtName: districtName,
                    blockName: blockName,
                    gpName: gpName,
                    deptName: deptName,
                    // sectorName: sectorName,
                    muniName: muniName,
                    schName:schName,
                    conName:conName
                   
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
      async getschemeid(scheme_sl: number) {
        let dept; // Declare dept before the try block
      
      
            dept = await this.masterSchemeRepository.findOne({ where: { scheme_sl },  select: ["schemeName","scheme_sl"] });
        
      
       
      
          return { errorCode: 0, result: dept };
      
         
        }
        async getsconid(cont_sl: number) {
          let dept; // Declare dept before the try block
        
        
              dept = await this.Contractor.findOne({ where: { cont_sl },  select: ["contractorName","cont_sl"] });
          
        
         
        
            return { errorCode: 0, result: dept };
        
           
          }

        
    }
