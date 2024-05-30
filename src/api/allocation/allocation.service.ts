import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { DemandMaster, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment, } from 'src/entity/workrequigition.entity';
import { In, Repository } from 'typeorm';
import { CreateWorkAllocationDto, WorkAllocationDto } from './dto/allocation.dto';

@Injectable()
export class AllocationService {
 constructor(
    @InjectRepository(MasterScheme)
    private  masterSchemeRepository: Repository<MasterScheme>,
    @InjectRepository(MasterSchemeExpenduture) private  MasterSchemeExpendutureRepository: Repository<MasterSchemeExpenduture>,
    @InjectRepository(MasterWorkerDemand_allotmenthistroy) private  Demandallotmenthistroy:Repository<MasterWorkerDemand_allotmenthistroy>,
    @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
    @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
    @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
    @InjectRepository(master_ps) private masterps: Repository<master_ps>,
    @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
    @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
    @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
    @InjectRepository(WorkAllocation) private workallocation: Repository<WorkAllocation>,
    @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
    @InjectRepository(MasterWorkerDemand_allotment) private MasterWorkerDemandallotment: Repository<MasterWorkerDemand_allotment>,
    @InjectRepository(MasterWorkerRequirement) private masterWorkerRequirement: Repository<MasterWorkerRequirement>,
    @InjectRepository(MasterWorkerRequirement_allotment) private masterWorkerRequirementallotment: Repository<MasterWorkerRequirement_allotment>,


) {}
private async generateWorkAllocationID(departmentName: number){
    const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `${departmentName}${random8Digits}`;
  }
  
  async create(createWorkAllocationDto: CreateWorkAllocationDto) {
    const reqId = createWorkAllocationDto.reqId;
    const reqDate = createWorkAllocationDto.reqDate;
  
    // Get department details to include the department name in the work allocation ID
    const department = await this.getDepatmentbyid(createWorkAllocationDto.workAllocations[0].departmentNo);
    const departmentName = department.result?.deptshort|| '';
  
    // Generate the work allocation ID using the department name
    const workAllocationID = await this.generateWorkAllocationID(departmentName);
  //const workAllocationID = this.generateWorkAllocationID();
  const newWorkAllocations = createWorkAllocationDto.workAllocations.map(workAllocationDto => {
    return this.workallocation.create({
      schemeArea: workAllocationDto.schemeArea,
      workAllocationID:workAllocationID,
      
      departmentNo: workAllocationDto.departmentNo,
      districtcode: workAllocationDto.districtcode,
      demanduniqueID:workAllocationDto.demanduniqueID,
      municipalityCode: workAllocationDto.municipalityCode,
      blockcode: workAllocationDto.blockcode,
      gpCode: workAllocationDto.gpCode,
      schemeId: workAllocationDto.schemeId,
      schemeName: workAllocationDto.schemeName,
      contractorID: workAllocationDto.contractorID,
      workerJobCardNo: workAllocationDto.workerJobCardNo,
      workerName: workAllocationDto.workerName,
      dateOfApplicationForWork: workAllocationDto.dateOfApplicationForWork,
      noOfDaysWorkDemanded: workAllocationDto.noOfDaysWorkDemanded,
      workAllocationFromDate: workAllocationDto.workAllocationFromDate,
      workAllocationToDate: workAllocationDto.workAllocationToDate,
      noOfDaysWorkAlloted: workAllocationDto.noOfDaysWorkAlloted,
      currentMonth: workAllocationDto.currentMonth,
      currentYear: workAllocationDto.currentYear,
      finYear: workAllocationDto.finYear,
      userIndex: workAllocationDto.userIndex,
    });
  });

  const result = await this.workallocation.save(newWorkAllocations);
  
  const workallocationsl = newWorkAllocations.map(allocation => allocation.workallocationsl);
  const workerJobCardNos = createWorkAllocationDto.workAllocations.map(dto => dto.workerJobCardNo);
  const demanduniqueIDs = createWorkAllocationDto.workAllocations.map(dto => dto.demanduniqueID);

  // Fetch and update records in DemandMaster
  const demandMasterRecords = await this.demandMaster.find({
      where: { 
          workerJobCardNo: In(workerJobCardNos),
          demanduniqueID: In(demanduniqueIDs)
      },
  });

  // Calculate the total work days for each job card number and demand unique ID
  const totalWorkDaysMap = new Map();

  for (let i = 0; i < newWorkAllocations.length; i++) {
      const workAllocationDto = createWorkAllocationDto.workAllocations[i];
      const key = `${workAllocationDto.workerJobCardNo}-${workAllocationDto.demanduniqueID}`;
      const startDate = new Date(workAllocationDto.workAllocationFromDate);
      const endDate = new Date(workAllocationDto.workAllocationToDate);
      const workDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

      if (totalWorkDaysMap.has(key)) {
          totalWorkDaysMap.set(key, totalWorkDaysMap.get(key) + workDays);
      } else {
          totalWorkDaysMap.set(key, workDays);
      }

      const newAllotment = this.Demandallotmenthistroy.create({
          allotmentuserIndex: workAllocationDto.userIndex,
          allocationID: workallocationsl[i],
          workerJobCardNo: workAllocationDto.workerJobCardNo,
          demanduniqueID: workAllocationDto.demanduniqueID,
          workAllotedstatus: "1",
          finYear_work: workAllocationDto.finYear,
          CurrentMonth_allot: workAllocationDto.currentMonth,
          CurrentYear_allot: workAllocationDto.currentYear,
          finYear_allot: workAllocationDto.finYear,
          dateofallotmentfrom: workAllocationDto.workAllocationFromDate,
          dateofallotmentto: workAllocationDto.workAllocationToDate,
      });
      await this.Demandallotmenthistroy.save(newAllotment); // Save the new allotment
  }

  for (let i = 0; i < newWorkAllocations.length; i++) {
      const workAllocationDto = createWorkAllocationDto.workAllocations[i];
      const key = `${workAllocationDto.workerJobCardNo}-${workAllocationDto.demanduniqueID}`;
      const totalWorkDays = totalWorkDaysMap.get(key);

      const matchingDemandMaster = demandMasterRecords.find(record =>
          record.workerJobCardNo === workAllocationDto.workerJobCardNo &&
          record.demanduniqueID === workAllocationDto.demanduniqueID
      );

      if (matchingDemandMaster) {
        if (matchingDemandMaster.workallostatus === "0") {
            // Calculate total pending work days
            matchingDemandMaster.total_pending = workAllocationDto.noOfDaysWorkDemanded - totalWorkDays;
            matchingDemandMaster.total_pending = Math.max(matchingDemandMaster.total_pending, 0); // Ensure non-negative
            matchingDemandMaster.workallostatus = "1";
        } else if (matchingDemandMaster.workallostatus === "1") {
            // Subtract current work allocation days from total pending
            matchingDemandMaster.total_pending -= workAllocationDto.noOfDaysWorkAlloted;
            matchingDemandMaster.total_pending = Math.max(matchingDemandMaster.total_pending, 0); // Ensure non-negative
        }
          matchingDemandMaster.workallostatus = "1";
          matchingDemandMaster.dateoflastallocation = workAllocationDto.workAllocationToDate;

          console.log("Updating DemandMaster:", {
              workerJobCardNo: matchingDemandMaster.workerJobCardNo,
              demanduniqueID: matchingDemandMaster.demanduniqueID,
              total_pending: matchingDemandMaster.total_pending,
              workallostatus: matchingDemandMaster.workallostatus,
              dateoflastallocation: matchingDemandMaster.dateoflastallocation,
          });

          await this.demandMaster.save(matchingDemandMaster); // Save the updated DemandMaster record
      } else {
          console.log("No matching record found for:", {
              workerJobCardNo: workAllocationDto.workerJobCardNo,
              demanduniqueID: workAllocationDto.demanduniqueID,
          });
      }
  }
  // Check if there is a matching record
const existingRecord = await this.masterWorkerRequirementallotment.findOne({
    where: { workerreqID: reqId, dateofwork: reqDate }
  });

  const totalUnskilledWorkers = createWorkAllocationDto.workAllocations.length;
  const submitTime = new Date(); 
  if (existingRecord) {
    await this.masterWorkerRequirementallotment.update(
      { workerreqID: reqId, dateofwork: reqDate }, 
      { allocationID: workAllocationID, allotmentuserIndex: createWorkAllocationDto.workAllocations[0].userIndex,
        dateofallotment:submitTime,
        noUnskilledWorkers:totalUnskilledWorkers,
        currentMonthAllot:createWorkAllocationDto.workAllocations[0].currentMonth,
      currentYearAllot:createWorkAllocationDto.workAllocations[0].currentYear,
       	finYearAllot:createWorkAllocationDto.workAllocations[0].finYear,
    } // Pass the userIndex from the first work allocation
    );
}
const allocation = workAllocationID;

  return {errorCode: 0, message:"Allocation Created Successfully",allocation};
}



async getAllscheme(scheme_sl: number) {
  try {
      const dist = await this.masterSchemeRepository.find({
          where: { scheme_sl },
          select: ["scheme_sl", "districtcode", "blockcode"],order: { scheme_sl: 'DESC' } 
      });
      
      return {
          errorCode: 0,
          result: dist
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong: " + error.message
      };
  }
}

async getdemandforallocation(blockcode: number, gpCode?: number) {
  try {
      let work;

      if (gpCode !== undefined) {
          work = await this.demandMaster.find({ where: { blockcode, gpCode } });
      } else {
          work = await this.demandMaster.find({ where: { blockcode } });
      }

      return { errorCode: 0, result: work };
  } catch (error) {
      return {
          errorCode: 1,
          message: 'Something went wrong: ' + error.message
      };
  }
}

async getDemandByScheme(scheme_sl: number) {
  try {
      const schemeResponse = await this.getAllscheme(scheme_sl);

      if (schemeResponse.errorCode !== 0 || schemeResponse.result.length === 0) {
          return { errorCode: 1, message: 'No schemes found or   schemes' };
      }

      const { districtcode, blockcode } = schemeResponse.result[0];
      const demandResponse = await this.getdemandforallocation(blockcode);

      return {
          errorCode: 0,
          result: demandResponse.result
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: 'Something went wrong: ' + error.message
      };
  }
}

// async getallocationList(userIndex: number) {
//   try {
//       const allocations = await this.workallocation.find({ where: { userIndex },  order: { workallocationsl: 'DESC' }  });

//       if (!allocations || allocations.length === 0) {
//           return {
//               errorCode: 1,
//               message: 'allocations not found for the provided user index',
//           };
//       }

//       const allocationsWithDetails = [];

//       await Promise.all(allocations.map(async (allocation) => {
//           try {
//               const districtDetails = await this.getAllDistricts(allocation.districtcode);
//               const districtName = districtDetails.result ? districtDetails.result.districtName : '';

//               const blockDetails = await this.getAllblock(allocation.blockcode);
//               const blockname = blockDetails.result ? blockDetails.result.blockName : '';

//               const gpDetails = await this.getAllgp(allocation.gpCode);
//               const gpName = gpDetails.result ? gpDetails.result.gpName : '';

//               const deptDetails = await this.getDepatmentbyid(allocation.departmentNo);
//               const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

//               const muniDetails = await this.getmunibyid(allocation.municipalityCode);
//               const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

              

//               allocationsWithDetails.push({
//                   ...allocation,
//                   districtName: districtName,
//                   blockname: blockname,
//                   gpName: gpName,
//                   deptName: deptName,
//                   muniName: muniName,
//               });
//           } catch (error) {
//               // Log the error for this contractor
//               console.error(`Failed to fetch details for contractor`);
//           }
//       }));

//       return {
//           errorCode: 0,
//           result: allocationsWithDetails,
//       };
//   } catch (error) {
//       console.error('Failed to fetch allocations from the database:', error);
//       throw new Error('Failed to fetch allocations from the database.');
//   }
// }
//

async getallocationList(userIndex: number) {
  try {
      // Find worker requirements by user index
      const allocations = await this.workallocation.find({ where: { userIndex },  order: { workallocationsl: 'DESC' }  });

      if (!allocations || allocations.length === 0) {
          return {
              errorCode: 1,
              message: 'allocations not found for the provided user index',
          };
      }

      // Get aggregated worker counts grouped by workerreqID
      const aggregatedWorkerCounts = await this.workallocation.createQueryBuilder('allocation')
          .select('allocation.workAllocationID', 'workAllocationID')
         
          .where('allocation.userIndex = :userIndex', { userIndex })
          .groupBy('allocation.workAllocationID')
          .getRawMany();

          const allocationdetails = [];

    

      for (const allocation of allocations) {
          // Fetch additional details for each worker requirement
          const districtDetails = await this.getAllDistricts(allocation.districtcode);
          const districtName = districtDetails.result ? districtDetails.result.districtName : '';

          const blockDetails = await this.getAllblock(allocation.blockcode);
          const blockName = blockDetails.result ? blockDetails.result.blockName : '';

          const gpDetails = await this.getAllgp(allocation.gpCode);
          const gpName = gpDetails.result ? gpDetails.result.gpName : '';

          const deptDetails = await this.getDepatmentbyid(allocation.departmentNo);
          const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

          const muniDetails = await this.getmunibyid(allocation.municipalityCode);
          const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

          // const sectorDetails = await this.getSectorbyid(schemeSector);
          // const sectorName = sectorDetails.result ? sectorDetails.result.sectorname : '';

          const sechDetails = await this.getschemeidforallocation(allocation.schemeId);
          const schName = sechDetails.result ? sechDetails.result.schemeName : '';
          const schemeId = sechDetails.result ? sechDetails.result.schemeId : '';
          const personDaysGenerated = sechDetails.result ? sechDetails.result.personDaysGenerated : '';

          const workorderNo = sechDetails.result ? sechDetails.result.workorderNo : '';
          const totalprojectCost = sechDetails.result ? sechDetails.result.totalprojectCost : '';
          const ExecutingDeptName = sechDetails.result ? sechDetails.result.ExecutingDeptName : '';
          const schemeSector = sechDetails.result ? sechDetails.result.schemeSector : '';
   

       
          // Push worker requirement with details into the array
          allocationdetails.push({
              ...allocation,
              districtName: districtName,
              blockName: blockName,
              gpName: gpName,
              deptName: deptName,
              muniName: muniName,
              schName: schName,
             
              schemeId:schemeId,
              schemeSector:schemeSector,
             personDaysGenerated:personDaysGenerated,

             workorderNo:workorderNo,
             totalprojectCost:totalprojectCost,
             ExecutingDeptName:ExecutingDeptName,


           
          });
      }

      // Return the array of worker requirements with details
      return {
          errorCode: 0,
          result: allocationdetails,
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: 'Failed to retrieve worker requirements: ' + error.message,
      };
  }
}


///
async getallocationListforemp(userIndex: number) {
    try {
      const allocations = await this.workallocation.find({
        where: { userIndex },
        order: { workallocationsl: 'DESC' }
      });
  
      if (!allocations || allocations.length === 0) {
        return {
          errorCode: 1,
          message: 'Allocations not found for the provided user index'
        };
      }
  
      // Group allocations by workAllocationID
      const allocationGroups = allocations.reduce((groups, allocation) => {
        if (!groups[allocation.workAllocationID]) {
          groups[allocation.workAllocationID] = {
            submitTime: allocation.submitTime.toISOString().split('T')[0], // Get date part of submitTime
            schemeId: allocation.schemeId,
            noOfDaysWorkDemanded: 0,
            districtcode: 0,
            blockcode: 0,
            noOfDaysWorkAlloted: 0,
            workAllocationID: allocation.workAllocationID
          };
        }
        groups[allocation.workAllocationID].noOfDaysWorkDemanded += allocation.noOfDaysWorkDemanded;
        groups[allocation.workAllocationID].districtcode = allocation.districtcode;
        groups[allocation.workAllocationID].noOfDaysWorkAlloted += allocation.noOfDaysWorkAlloted;
        groups[allocation.workAllocationID].blockcode = allocation.blockcode;
        return groups;
      }, {});
  
      const allocationsWithDetails = [];
  
      await Promise.all(Object.values(allocationGroups).map(async (group: any) => {
        try {
          const schemeDetails = await this.masterSchemeRepository.findOne({
            where: { scheme_sl: group.schemeId }
          });
          if (!schemeDetails) {
            throw new Error(`Scheme details not found for schemeId ${group.schemeId}`);
          }
  
          const districtDetails = await this.getAllDistricts(group.districtcode);
          const districtName = districtDetails.result ? districtDetails.result.districtName : '';
  
          const blockDetails = await this.getAllblock(group.blockcode);
          const blockName = blockDetails.result ? blockDetails.result.blockName : '';
  
          const gpDetails = await this.getAllgp(group.gpCode);
          const gpName = gpDetails.result ? gpDetails.result.gpName : '';
  
          const deptDetails = await this.getDepatmentbyid(group.departmentNo);
          const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
  
          const muniDetails = await this.getmunibyid(group.municipalityCode);
          const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
  

          const contractorID = parseInt(group.contractorID, 10);
          // Pass the converted integer to the getpedabyid function if it's a valid number
          let contractorName = '';
          if (!isNaN(contractorID)) {
          
        
          const conDetails = await this.getsconid(contractorID);
          const contractorName = conDetails.result ? conDetails.result.contractorName : '';
          }
          allocationsWithDetails.push({
            submitTime: group.submitTime,
            noOfDaysWorkDemanded: group.noOfDaysWorkDemanded,
            noOfDaysWorkAlloted: group.noOfDaysWorkAlloted,
            districtcode: group.districtcode,
            districtName: districtName,
            blockcode: group.blockcode,
            blockName: blockName,
            gpName: gpName,
            deptName: deptName,
            muniName: muniName,
            conName: contractorName,
            schemeId: group.schemeId,
            workAllocationID: group.workAllocationID,
            schemeName: schemeDetails.schemeName,
            FundingDepttID: schemeDetails.FundingDepttID,
            FundingDeptname: schemeDetails.FundingDeptname,
            ExecutingDepttID: schemeDetails.ExecutingDepttID,
            ExecutingDeptName: schemeDetails.ExecutingDeptName,
            ImplementingAgencyID: schemeDetails.ImplementingAgencyID,
            ImplementingAgencyName: schemeDetails.ImplementingAgencyName,
            StatusOfWork: schemeDetails.StatusOfWork,
            tentativeStartDate: schemeDetails.tentativeStartDate,
            ActualtartDate: schemeDetails.ActualtartDate,
            ExpectedCompletionDate: schemeDetails.ExpectedCompletionDate,
            totalprojectCost: schemeDetails.totalprojectCost,
            totalWageCost: schemeDetails.totalWageCost,
            totalLabour: schemeDetails.totalLabour,
            personDaysGenerated: schemeDetails.personDaysGenerated,
            totalUnskilledWorkers: schemeDetails.totalUnskilledWorkers,
            totalSemiSkilledWorkers: schemeDetails.totalSemiSkilledWorkers,
            totalSkilledWorkers: schemeDetails.totalSkilledWorkers,
            workorderNo: schemeDetails.workorderNo,
            workOderDate: schemeDetails.workOderDate,
            ControctorID: schemeDetails.ControctorID,
          });
        } catch (error) {
          console.error(`Failed to fetch details for group with submitTime ${group.submitTime}:`, error);
        }
      }));
  
      return {
        errorCode: 0,
        result: allocationsWithDetails,
      };
    } catch (error) {
      console.error('Failed to fetch allocations from the database:', error);
      throw new Error('Failed to fetch allocations from the database.');
    }
  }
  


async allocationempfinalliat(workAllocationID: string) {
  try {
      const allocations = await this.workallocation.find({ where: { workAllocationID }, order: { workallocationsl: 'DESC' } });

      if (!allocations || allocations.length === 0) {
          return {
              errorCode: 1,
              message: 'allocations not found for the provided workAllocationID',
          };
      }

      const allocationsWithDetails = [];

      await Promise.all(allocations.map(async (allocation) => {
          try {
              // Fetch additional details if needed. For example:
              const districtDetails = await this.getAllDistricts(allocation.districtcode);
                const districtName = districtDetails.result ? districtDetails.result.districtName : '';

                // Fetch block details
                const blockDetails = await this.getAllblock(allocation.blockcode);
                const blockName = blockDetails.result ? blockDetails.result.blockName : '';


                const Id = parseInt(allocation.schemeId, 10);

                // Pass the converted integer to the getpedabyid function if it's a valid number
                let pedaName = '';
                if (!isNaN(Id)) {
             
                const sechDetails = await this.getschemeid(Id);
                const schName = sechDetails.result ? sechDetails.result.schemeName : '';
                }

                const contractorID = parseInt(allocation.contractorID, 10);
                // Fetch block details
                const conDetails = await this.getsconid(contractorID);
                const conName = conDetails.result ? conDetails.result.contractorName : '';




             
              allocationsWithDetails.push({
                  ...allocation,
                  districtName: districtName,
                  blockName: blockName,
                  schName:pedaName,
                  conName:conName

              });
          } catch (error) {
              // Log the error for this allocation
              console.error(`Failed to fetch details for allocation with ID ${allocation.workallocationsl}`);
          }
      }));

      return {
          errorCode: 0,
          result: allocationsWithDetails,
      };
  } catch (error) {
      console.error('Failed to fetch allocations from the database:', error);
      return {
          errorCode: 1,
          message: 'Something went wrong: ' + error.message,
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


      dept = await this.masterdepartment.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo","deptshort"] });
  

 

    return { errorCode: 0, result: dept };

   
  }

  async getschemeid(scheme_sl: number) {
    let dept; // Declare dept before the try block
  
  
        dept = await this.masterSchemeRepository.findOne({ where: { scheme_sl },  select: ["schemeName","scheme_sl"] });
    
  
   
  
      return { errorCode: 0, result: dept };
  
     
    }

    async getschemeidforallocation(schemeId: string) {
      let dept; // Declare dept before the try block
    
    
          dept = await this.masterSchemeRepository.findOne({ where: { schemeId },  select: ["schemeName","scheme_sl","schemeId","personDaysGenerated","workorderNo","totalprojectCost","ExecutingDeptName","schemeSector"] });
      
    
     
    
        return { errorCode: 0, result: dept };
    
       
      }
    
    async getsconid(cont_sl: number) {
      let dept; // Declare dept before the try block
    
    
          dept = await this.Contractor.findOne({ where: { cont_sl },  select: ["contractorName","cont_sl"] });
      
    
     
    
        return { errorCode: 0, result: dept };
    
       
      }

  async getmunibyid(urbanCode: number) {
      let dept; // Declare dept before the try block
    
   
          dept = await this.masterurban.findOne({ where: { urbanCode },  select: ["urbanName","urbanCode"] });
      
    
     
    
        return { errorCode: 0, result: dept };
  
       
      }



}
