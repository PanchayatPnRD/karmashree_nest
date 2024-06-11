import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { DemandMaster, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment, } from 'src/entity/workrequigition.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateWorkAllocationDto, WorkAllocationDto } from './dto/allocation.dto';
import { EmploymentDto } from '../employment/dto/employment.dto';

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
    @InjectRepository(MasterWorkerDemand_allotmenthistroy) private MasterWorkerDemandallotmenthistroy: Repository<MasterWorkerDemand_allotmenthistroy>,

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
          allocationID: workAllocationID,
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

     
          await this.demandMaster.save(matchingDemandMaster); // Save the updated DemandMaster record
      } else {
          console.log("No matching record found for:", {
              workerJobCardNo: workAllocationDto.workerJobCardNo,
              demanduniqueID: workAllocationDto.demanduniqueID,
          });
      }
  }
  // Check if there is a matching record
  const existingRecords = await this.masterWorkerRequirementallotment.find({
    where: { workerreqID: reqId }
});

const totalUnskilledWorkers = createWorkAllocationDto.workAllocations.length;
const submitTime = new Date();

for (const existingRecord of existingRecords) {
    await this.masterWorkerRequirementallotment.update(
        { workersl: existingRecord.workersl }, // Ensure this matches your entity's unique identifier
        {
            allocationID: workAllocationID,
            allotmentuserIndex: createWorkAllocationDto.workAllocations[0].userIndex,
            dateofallotment: submitTime,
            noUnskilledWorkers: totalUnskilledWorkers,
            currentMonthAllot: createWorkAllocationDto.workAllocations[0].currentMonth,
            currentYearAllot: createWorkAllocationDto.workAllocations[0].currentYear,
            finYearAllot: createWorkAllocationDto.workAllocations[0].finYear,
        }
    );
}


const allocation = workAllocationID;

  return {errorCode: 0, message:"Allocation Created Successfully",allocation};
}



async getAllscheme(scheme_sl: number) {
  try {
      const dist = await this.masterSchemeRepository.find({
          where: { scheme_sl },
          select: ["scheme_sl", "districtcode", "blockcode","gpCode"],order: { scheme_sl: 'DESC' } 
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

// async getdemandforallocation(districtcode: number, blockcode: number, gpCode?: number) {
//   try {
//     let work;

//     // Initialize the query with mandatory filters
//     let query = this.demandMaster.createQueryBuilder('demand');

//     // Add filters based on the provided parameters
//     if (gpCode !== undefined) {
//       query = query.where('demand.districtcode = :districtcode', { districtcode })
//                    .andWhere('demand.gpCode = :gpCode', { gpCode });
//     } else if (blockcode !== undefined) {
//       query = query.where('demand.districtcode = :districtcode', { districtcode })
//                    .andWhere('demand.blockcode = :blockcode', { blockcode });
//     } else {
//       query = query.where('demand.districtcode = :districtcode', { districtcode });
//     }

//     // Execute the query
//     work = await query.getMany();

//     // Check if work demands are found
//     if (!work || work.length === 0) {
//       return { errorCode: 1, message: 'No demands found for the provided filters' };
//     }

//     // Filter demands based on workallostatus and total_pending conditions
//     const filteredWork = work.filter(demand => !(demand.workallostatus === '1' && demand.total_pending === 0));

//     // Check if any open demands are available
//     if (filteredWork.length === 0) {
//       return { errorCode: 1, message: 'No open demand available', result: [] };
//     }

//     // Fetch additional details for each work demand in parallel
//     const workDetailsPromises = filteredWork.map(async (demand) => {
//       try {
//         const [
//           districtDetails,
//           blockDetails,
//           gpDetails,
//           deptDetails,
//           muniDetails,
//           sechDetails
//         ] = await Promise.all([
//           this.getAllDistricts(demand.districtcode),
//           this.getAllblock(demand.blockcode),
//           this.getAllgp(demand.gpCode),
//           this.getDepatmentbyid(demand.departmentNo),
//           this.getmunibyid(demand.municipalityCode),
//           this.getschemeid(demand.schemeId)
//         ]);

//         const districtName = districtDetails.result?.districtName || '';
//         const blockName = blockDetails.result?.blockName || '';
//         const gpName = gpDetails.result?.gpName || '';
//         const deptName = deptDetails.result?.departmentName || '';
//         const muniName = muniDetails.result?.urbanName || '';
//         const schName = sechDetails.result?.schemeName || '';
//         const schemeId = sechDetails.result?.schemeId || '';
//         const personDaysGenerated = sechDetails.result?.personDaysGenerated || '';
//         const workorderNo = sechDetails.result?.workorderNo || '';
//         const totalprojectCost = sechDetails.result?.totalprojectCost || '';
//         const ExecutingDeptName = sechDetails.result?.ExecutingDeptName || '';
//         const schemeSector = sechDetails.result?.schemeSector || '';

//         return {
//           ...demand,
//           districtName,
//           blockName,
//           gpName,
//           deptName,
//           muniName,
//           schName,
//           schemeId,
//           schemeSector,
//           personDaysGenerated,
//           workorderNo,
//           totalprojectCost,
//           ExecutingDeptName
//         };
//       } catch (detailError) {
//         // Log individual demand detail fetching error
//         console.error(`Failed to fetch details for demand with ID `, detailError);
//         return { ...demand, error: detailError.message };
//       }
//     });

//     const workDetails = await Promise.all(workDetailsPromises);

//     return { errorCode: 0, result: workDetails };
//   } catch (error) {
//     return {
//       errorCode: 1,
//       message: 'Something went wrong: ' + error.message
//     };
//   }
// }

  


// async getDemandByScheme(scheme_sl: number) {
//   try {
//       const schemeResponse = await this.getAllscheme(scheme_sl);
// console.log("asvdca");
//       if (schemeResponse.errorCode !== 0 || schemeResponse.result.length === 0) {
//         console.log("asvdca2");
//           return { errorCode: 1, message: 'No schemes found or   schemes' };
//       }

//       const { districtcode, blockcode,gpCode } = schemeResponse.result[0];
//       console.log("asvdca3");
//       const demandResponse = await this.getdemandforallocation(blockcode,districtcode,gpCode);
//       console.log("asvdca44");

//       return {
//           errorCode: 0,
//           result: demandResponse.result
//       };
//   } catch (error) {
//       return {
//           errorCode: 1,
//           message: 'Something went wrong: ' + error.message
//       };
//   }
// }

async getallocationList(userIndex: number) {
  try {
      // Find worker allocations by user index
      const allocations = await this.workallocation.find({
          where: { userIndex },
          order: { workallocationsl: 'DESC' }
      });

      if (!allocations || allocations.length === 0) {
          return {
              errorCode: 1,
              message: 'Allocations not found for the provided user index',
          };
      }

      // Get aggregated worker counts grouped by workAllocationID
      const aggregatedWorkerCounts = await this.workallocation.createQueryBuilder('allocation')
          .select('allocation.workAllocationID', 'workAllocationID')
          .addSelect('SUM(allocation.noOfDaysWorkDemanded)', 'noOfDaysWorkDemanded')
          .addSelect('SUM(allocation.noOfDaysWorkAlloted)', 'noOfDaysWorkAlloted')
          .addSelect('MAX(allocation.workAllocationToDate)', 'workAllocationToDate')
          .addSelect('MAX(allocation.empStatus)', 'empStatus')
          .addSelect('MAX(allocation.empDate)', 'empDate')
          .addSelect('MAX(allocation.empId)', 'empId')
          .addSelect('MAX(allocation.finYear)', 'finYear')
          .where('allocation.userIndex = :userIndex', { userIndex })
          .groupBy('allocation.workAllocationID')
          .getRawMany();

      // Create a map for easy lookup of aggregated worker counts
      const workerCountsMap = aggregatedWorkerCounts.reduce((map, count) => {
          map[count.workAllocationID] = {
              noOfDaysWorkDemanded: parseInt(count.noOfDaysWorkDemanded, 10),
              noOfDaysWorkAlloted: parseInt(count.noOfDaysWorkAlloted, 10),
              workAllocationToDate: count.workAllocationToDate,
              empStatus: count.empStatus,
              empDate: count.empDate,
              empId: count.empId,
              finYear: count.finYear,
          };
          return map;
      }, {});

      // Aggregate allocations by workAllocationID
      const allocationsMap = allocations.reduce((map, allocation) => {
          if (!map[allocation.workAllocationID]) {
              map[allocation.workAllocationID] = [];
          }
          map[allocation.workAllocationID].push(allocation);
          return map;
      }, {});

      // Fetch additional details for each workAllocationID in parallel
      const allocationDetailsPromises = Object.keys(allocationsMap).map(async (workAllocationID) => {
          const allocationGroup = allocationsMap[workAllocationID];

          // Assuming the first allocation in the group represents the general details
          const baseAllocation = allocationGroup[0];

          const [districtDetails, blockDetails, gpDetails, deptDetails, muniDetails, sechDetails] = await Promise.all([
              this.getAllDistricts(baseAllocation.districtcode),
              this.getAllblock(baseAllocation.blockcode),
              this.getAllgp(baseAllocation.gpCode),
              this.getDepatmentbyid(baseAllocation.departmentNo),
              this.getmunibyid(baseAllocation.municipalityCode),
              this.getschemeid(baseAllocation.schemeId)
          ]);

          const districtName = districtDetails.result?.districtName || '';
          const blockName = blockDetails.result?.blockName || '';
          const gpName = gpDetails.result?.gpName || '';
          const deptName = deptDetails.result?.departmentName || '';
          const muniName = muniDetails.result?.urbanName || '';
          const schName = sechDetails.result?.schemeName || '';
          const schemeId = sechDetails.result?.schemeId || '';
          const personDaysGenerated = sechDetails.result?.personDaysGenerated || '';
          const workorderNo = sechDetails.result?.workorderNo || '';
          const totalprojectCost = sechDetails.result?.totalprojectCost || '';
          const ExecutingDeptName = sechDetails.result?.ExecutingDeptName || '';
          const schemeSector = sechDetails.result?.schemeSector || '';

          const workerCounts = workerCountsMap[workAllocationID] || {
              noOfDaysWorkDemanded: 0,
              noOfDaysWorkAlloted: 0,
              workAllocationToDate: '',
              empStatus: '',
              empDate: '',
              empId: '',
              finYear: '',
          };

          return {
              workAllocationID,
              workAllocationToDate: workerCounts.workAllocationToDate,
              finYear: workerCounts.finYear,
              empStatus: workerCounts.empStatus,
              empDate: workerCounts.empDate,
              empId: workerCounts.empId,
              districtName,
              blockName,
              gpName,
              deptName,
              muniName,
              schName,
              schemeId,
              schemeSector,
              personDaysGenerated,
              workorderNo,
              totalprojectCost,
              ExecutingDeptName,
              noOfDaysWorkDemanded: workerCounts.noOfDaysWorkDemanded,
              noOfDaysWorkAlloted: workerCounts.noOfDaysWorkAlloted,
          };
      });

      const allocationDetails = await Promise.all(allocationDetailsPromises);

      // Return the array of worker requirements with details
      return {
          errorCode: 0,
          result: allocationDetails,
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: 'Failed to retrieve worker requirements: ' + error.message,
      };
  }
}



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
          workAllocationID: allocation.workAllocationID,
          gpCode: allocation.gpCode, 
          empStatus: allocation.empStatus, 
          empId: allocation.empId, 
          empDate: allocation.empDate, 
        
          departmentNo: allocation.departmentNo, // Added for fetching department details
          municipalityCode: allocation.municipalityCode, // Added for fetching municipality details
          contractorID: allocation.contractorID // Added for fetching contractor details
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

        const [
          districtDetails,
          blockDetails,
          gpDetails,
          deptDetails,
          muniDetails,
          conDetails,
          requirementDetails
        ] = await Promise.all([
          this.getAllDistricts(group.districtcode),
          this.getAllblock(group.blockcode),
          this.getAllgp(group.gpCode),
          this.getDepatmentbyid(group.departmentNo),
          this.getmunibyid(group.municipalityCode),
          this.getsconid(parseInt(group.contractorID, 10)),
          this.masterWorkerRequirementallotment.findOne({ where: { allocationID: group.workAllocationID } })
        ]);

        const districtName = districtDetails.result ? districtDetails.result.districtName : '';
        const blockName = blockDetails.result ? blockDetails.result.blockName : '';
        const gpName = gpDetails.result ? gpDetails.result.gpName : '';
        const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
        const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
        const contractorName = conDetails.result ? conDetails.result.contractorName : '';

        const requirementData = requirementDetails ? {
          workerreqID: requirementDetails.workerreqID,
          schemeArea: requirementDetails.schemeArea,
          dateofwork: requirementDetails.dateofwork,
          unskilledWorkers: requirementDetails.unskilledWorkers,
          semiSkilledWorkers: requirementDetails.semiSkilledWorkers,
          skilledWorkers: requirementDetails.skilledWorkers,
          contactPersonName: requirementDetails.contactPersonName,
          contactPersonPhoneNumber: requirementDetails.contactPersonPhoneNumber,
          FundingDeptname: requirementDetails.FundingDeptname,
          currentMonthWork: requirementDetails.currentMonthWork,
          currentYearWork: requirementDetails.currentYearWork,
          finYearWork: requirementDetails.finYearWork,
          dateofallotment: requirementDetails.dateofallotment,
          noUnskilledWorkers: requirementDetails.noUnskilledWorkers,
          noSemiSkilledWorkers: requirementDetails.noSemiSkilledWorkers,
          noSkilledWorkers: requirementDetails.noSkilledWorkers,
          currentMonthAllot: requirementDetails.currentMonthAllot,
          currentYearAllot: requirementDetails.currentYearAllot,
          finYearAllot: requirementDetails.finYearAllot,
          allotmentuserIndex: requirementDetails.allotmentuserIndex,
          submitTimereq: requirementDetails.submitTime
        } : {};

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
          empStatus: group.empStatus, 
          empId: group.empId, 
          empDate: group.empDate, 
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
          totalwagescostinvoled: schemeDetails.totalwagescostinvoled,
          totalLabour: schemeDetails.totalLabour,
          personDaysGenerated: schemeDetails.personDaysGenerated,
          totalUnskilledWorkers: schemeDetails.totalUnskilledWorkers,
          totalSemiSkilledWorkers: schemeDetails.totalSemiSkilledWorkers,
          totalSkilledWorkers: schemeDetails.totalSkilledWorkers,
          workorderNo: schemeDetails.workorderNo,
          workOderDate: schemeDetails.workOderDate,
          ControctorID: schemeDetails.ControctorID,
          totalCostprovided: schemeDetails.totalCostprovided,
          personDaysGeneratedprovided: schemeDetails.personDaysGeneratedprovided,
          totalLabourprovided: schemeDetails.totalLabourprovided,

        
          ...requirementData
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
    return {
      errorCode: 1,
      message: 'Failed to fetch allocations from the database.'
    };
  }
}




// async getallocationListforemp(userIndex: number) {
//     try {
//       const allocations = await this.workallocation.find({
//         where: { userIndex },
//         order: { workallocationsl: 'DESC' }
//       });
  
//       if (!allocations || allocations.length === 0) {
//         return {
//           errorCode: 1,
//           message: 'Allocations not found for the provided user index'
//         };
//       }
  
//       // Group allocations by workAllocationID
//       const allocationGroups = allocations.reduce((groups, allocation) => {
//         if (!groups[allocation.workAllocationID]) {
//           groups[allocation.workAllocationID] = {
//             submitTime: allocation.submitTime.toISOString().split('T')[0], // Get date part of submitTime
//             schemeId: allocation.schemeId,
//             noOfDaysWorkDemanded: 0,
//             districtcode: 0,
//             blockcode: 0,
//             noOfDaysWorkAlloted: 0,
//             workAllocationID: allocation.workAllocationID
//           };
//         }
//         groups[allocation.workAllocationID].noOfDaysWorkDemanded += allocation.noOfDaysWorkDemanded;
//         groups[allocation.workAllocationID].districtcode = allocation.districtcode;
//         groups[allocation.workAllocationID].noOfDaysWorkAlloted += allocation.noOfDaysWorkAlloted;
//         groups[allocation.workAllocationID].blockcode = allocation.blockcode;
//         return groups;
//       }, {});
  
//       const allocationsWithDetails = [];
  
//       await Promise.all(Object.values(allocationGroups).map(async (group: any) => {
//         try {
//           const schemeDetails = await this.masterSchemeRepository.findOne({
//             where: { scheme_sl: group.schemeId }
//           });
//           if (!schemeDetails) {
//             throw new Error(`Scheme details not found for schemeId ${group.schemeId}`);
//           }
  
//           const districtDetails = await this.getAllDistricts(group.districtcode);
//           const districtName = districtDetails.result ? districtDetails.result.districtName : '';
  
//           const blockDetails = await this.getAllblock(group.blockcode);
//           const blockName = blockDetails.result ? blockDetails.result.blockName : '';
  
//           const gpDetails = await this.getAllgp(group.gpCode);
//           const gpName = gpDetails.result ? gpDetails.result.gpName : '';
  
//           const deptDetails = await this.getDepatmentbyid(group.departmentNo);
//           const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
  
//           const muniDetails = await this.getmunibyid(group.municipalityCode);
//           const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
  

//           const contractorID = parseInt(group.contractorID, 10);
//           // Pass the converted integer to the getpedabyid function if it's a valid number
//           let contractorName = '';
//           if (!isNaN(contractorID)) {
          
        
//           const conDetails = await this.getsconid(contractorID);
//           const contractorName = conDetails.result ? conDetails.result.contractorName : '';
//           }
//           allocationsWithDetails.push({
//             submitTime: group.submitTime,
//             noOfDaysWorkDemanded: group.noOfDaysWorkDemanded,
//             noOfDaysWorkAlloted: group.noOfDaysWorkAlloted,
//             districtcode: group.districtcode,
//             districtName: districtName,
//             blockcode: group.blockcode,
//             blockName: blockName,
//             gpName: gpName,
//             deptName: deptName,
//             muniName: muniName,
//             conName: contractorName,
//             schemeId: group.schemeId,
//             workAllocationID: group.workAllocationID,
//             schemeName: schemeDetails.schemeName,
//             FundingDepttID: schemeDetails.FundingDepttID,
//             FundingDeptname: schemeDetails.FundingDeptname,
//             ExecutingDepttID: schemeDetails.ExecutingDepttID,
//             ExecutingDeptName: schemeDetails.ExecutingDeptName,
//             ImplementingAgencyID: schemeDetails.ImplementingAgencyID,
//             ImplementingAgencyName: schemeDetails.ImplementingAgencyName,
//             StatusOfWork: schemeDetails.StatusOfWork,
//             tentativeStartDate: schemeDetails.tentativeStartDate,
//             ActualtartDate: schemeDetails.ActualtartDate,
//             ExpectedCompletionDate: schemeDetails.ExpectedCompletionDate,
//             totalprojectCost: schemeDetails.totalprojectCost,
//             totalwagescostinvoled: schemeDetails.totalwagescostinvoled,
//             totalLabour: schemeDetails.totalLabour,
//             personDaysGenerated: schemeDetails.personDaysGenerated,
//             totalUnskilledWorkers: schemeDetails.totalUnskilledWorkers,
//             totalSemiSkilledWorkers: schemeDetails.totalSemiSkilledWorkers,
//             totalSkilledWorkers: schemeDetails.totalSkilledWorkers,
//             workorderNo: schemeDetails.workorderNo,
//             workOderDate: schemeDetails.workOderDate,
//             ControctorID: schemeDetails.ControctorID,
//           });
//         } catch (error) {
//           console.error(`Failed to fetch details for group with submitTime ${group.submitTime}:`, error);
//         }
//       }));
  
//       return {
//         errorCode: 0,
//         result: allocationsWithDetails,
//       };
//     } catch (error) {
//       console.error('Failed to fetch allocations from the database:', error);
//       throw new Error('Failed to fetch allocations from the database.');
//     }
//   }
  

//emplymebntdemandlist


async allocationempfinalliat(workAllocationID: string) {
    try {
        const allocations = await this.workallocation.find({ where: { workAllocationID }, order: { workallocationsl: 'DESC' } });

        if (!allocations || allocations.length === 0) {
            return {
                errorCode: 1,
                message: 'Allocations not found for the provided workAllocationID',
            };
        }

        const allocationsWithDetails = [];

        await Promise.all(allocations.map(async (allocation) => {
            try {
                // Fetch district details
                const districtDetails = await this.getAllDistricts(allocation.districtcode);
                const districtName = districtDetails.result ? districtDetails.result.districtName : '';

                // Fetch block details
                const blockDetails = await this.getAllblock(allocation.blockcode);
                const blockName = blockDetails.result ? blockDetails.result.blockName : '';

                // Fetch scheme details
                const schemeId = parseInt(allocation.schemeId, 10);
                let schName = '';
                if (!isNaN(schemeId)) {
                    const schemeDetails = await this.getschemeid(schemeId);
                    schName = schemeDetails.result ? schemeDetails.result.schemeName : '';
                }

                // Fetch contractor details
                const contractorID = parseInt(allocation.contractorID, 10);
                let conName = '';
                if (!isNaN(contractorID)) {
                    const contractorDetails = await this.getsconid(contractorID);
                    conName = contractorDetails.result ? contractorDetails.result.contractorName : '';
                }

                // Fetch worker requirement details
                const requirementDetails = await this.masterWorkerRequirementallotment.findOne({ where: { allocationID: workAllocationID } });
                const requirementData = requirementDetails ? {
                    workerreqID: requirementDetails.workerreqID,
                    submitTimereq: requirementDetails.submitTime,
                    schemeArea: requirementDetails.schemeArea,
                    dateofwork: requirementDetails.dateofwork,
                    unskilledWorkers: requirementDetails.unskilledWorkers,
                    semiSkilledWorkers: requirementDetails.semiSkilledWorkers,
                    skilledWorkers: requirementDetails.skilledWorkers,
                    contactPersonName: requirementDetails.contactPersonName,
                    contactPersonPhoneNumber: requirementDetails.contactPersonPhoneNumber,
                    FundingDeptname: requirementDetails.FundingDeptname,
                    currentMonthWork: requirementDetails.currentMonthWork,
                    currentYearWork: requirementDetails.currentYearWork,
                    finYearWork: requirementDetails.finYearWork,
                    dateofallotment: requirementDetails.dateofallotment,
                    noUnskilledWorkers: requirementDetails.noUnskilledWorkers,
                    noSemiSkilledWorkers: requirementDetails.noSemiSkilledWorkers,
                    noSkilledWorkers: requirementDetails.noSkilledWorkers,
                    currentMonthAllot: requirementDetails.currentMonthAllot,
                    currentYearAllot: requirementDetails.currentYearAllot,
                    finYearAllot: requirementDetails.finYearAllot,
                    allotmentuserIndex: requirementDetails.allotmentuserIndex,
                   
                } : {};

                allocationsWithDetails.push({
                    ...allocation,
                    districtName,
                    blockName,
                    schName,
                    conName,
                    requirementData // include requirement details if needed
                });
            } catch (error) {
                console.error(`Failed to fetch details for allocation with ID ${allocation.workallocationsl}: ${error.message}`);
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
  
  
        dept = await this.masterSchemeRepository.findOne({ where: { scheme_sl },  select: ["schemeName","scheme_sl","schemeId","personDaysGenerated","workorderNo","totalprojectCost","ExecutingDeptName","schemeSector"] });
    

   
  
      return { errorCode: 0, result: dept };
  
     
    }

    async getschemeidforallocation(schemeId: string) {
      let dept; // Declare dept before the try block
    
    
          dept = await this.masterSchemeRepository.find({ where: { schemeId },  select: ["schemeName","scheme_sl","schemeId","personDaysGenerated","workorderNo","totalprojectCost","ExecutingDeptName","schemeSector"] });
      
    
     
    
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

    

      async getallocationdemandview(allocationID: string) {
        try {
            if (!allocationID || allocationID === "0") {
                return { errorCode: 1, message: 'Invalid allocationID' };
            }
    
            // Retrieve records from workallocation based on allocationID
            const allocations: WorkAllocation[] = await this.workallocation.find({
                where: { workAllocationID: allocationID },
            });
    
            if (!Array.isArray(allocations) || allocations.length === 0) {
                return { errorCode: 1, message: 'Allocations not found for the provided allocation ID' };
            }
    
            // Retrieve records from MasterWorkerDemandallotmenthistroy based on allocationID
            const allocationHistoryRecords = await this.MasterWorkerDemandallotmenthistroy.find({
                where: { allocationID },
            });
    
            if (!Array.isArray(allocationHistoryRecords) || allocationHistoryRecords.length === 0) {
                return { errorCode: 1, message: 'Allocation history not found' };
            }
    
            // Extract demanduniqueIDs from the allocation history records
            const demanduniqueIDs = allocationHistoryRecords.map(record => record.demanduniqueID);
    
            // Fetch corresponding data from the DemandMaster table
            const demandMasterRecords = await this.demandMaster.find({
                where: { demanduniqueID: In(demanduniqueIDs) },
            });
    
            if (!Array.isArray(demandMasterRecords) || demandMasterRecords.length === 0) {
                return { errorCode: 1, message: 'DemandMaster records not found' };
            }
    
            // Combine allocation and demand master data into a structured response
            const result = await Promise.all(allocations.map(async allocation => {
                const relatedDemandMasters = demandMasterRecords.filter(demandMaster =>
                    demanduniqueIDs.includes(demandMaster.demanduniqueID)
                );
    
                // Retrieve scheme details using schemeId from allocation
                const schemeIdResult = await this.getschemeid(parseInt(allocation.schemeId));
                const schemeId = schemeIdResult.result.schemeId;
    
                // Merge the allocation data with the related demand master data
                const mergedData = relatedDemandMasters.map(demandMaster => ({
                    ...allocation,
                    demandMaster,
                    schemeId,
                }));
    
                return mergedData;
            }));
    
            // Flatten the array to avoid nested arrays
            const flattenedResult = result.flat();
    
            return {
                errorCode: 0,
                result: flattenedResult,
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong while retrieving allocation demand view: " + error.message,
            };
        }
    }
    


}
