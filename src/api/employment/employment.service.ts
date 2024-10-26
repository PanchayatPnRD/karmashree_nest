import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employment } from 'src/entity/employment.entity';
import { In, Repository } from 'typeorm';
import { CreateEmploymentDto, EmploymentDto } from './dto/employment.dto';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';
import { DemandMaster, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { differenceInDays, addDays } from 'date-fns';
@Injectable()
export class EmploymentService {
    constructor(
      @InjectRepository(MasterWorkerRequirement) private masterWorkerRequirement: Repository<MasterWorkerRequirement>,
      @InjectRepository(MasterWorkerRequirement_allotment) private masterWorkerRequirementallotment: Repository<MasterWorkerRequirement_allotment>,
        @InjectRepository(Employment)private  employment: Repository<Employment>,
        @InjectRepository(WorkAllocation) private workallocation: Repository<WorkAllocation>,
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        @InjectRepository(MasterScheme)
        private  masterSchemeRepository: Repository<MasterScheme>,
        @InjectRepository(MasterSchemeExpenduture) private  MasterSchemeExpendutureRepository: Repository<MasterSchemeExpenduture>,
        @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(mastersector) private mastersector: Repository<mastersector>,
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        @InjectRepository(MasterWorkerDemand_allotmenthistroy) private  Demandallotmenthistroy:Repository<MasterWorkerDemand_allotmenthistroy>,
        
    ) {}
    private generateEMPID(): string {
      const random6Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
      return `EMP${random6Digits}D`;
    }

    private generateEMPID22(): string {
      const random6Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
      return `EMP${random6Digits}`;
    }
    async create(createDto: EmploymentDto) {
      const employmentID = this.generateEMPID22();
  
      const newWorkAllocations = createDto.CreateEmploymentDtos.map(CreateEmploymentDto => {
          return this.employment.create({
              employmentID: employmentID,
              schemeArea: CreateEmploymentDto.schemeArea,
              departmentNo: CreateEmploymentDto.departmentNo,
              districtcode: CreateEmploymentDto.districtcode,
              municipalityCode: CreateEmploymentDto.municipalityCode,
              blockcode: CreateEmploymentDto.blockcode,
              gpCode: CreateEmploymentDto.gpCode,
              schemeId: CreateEmploymentDto.schemeId,
              demandid: CreateEmploymentDto.demandid,
              schemeSector: CreateEmploymentDto.schemeSector,
              FundingDepttID: CreateEmploymentDto.FundingDepttID,
              FundingDeptname: CreateEmploymentDto.FundingDeptname,
              ExecutingDepttID: CreateEmploymentDto.ExecutingDepttID,
              ExecutingDeptName: CreateEmploymentDto.ExecutingDeptName,
              ImplementingAgencyID: CreateEmploymentDto.ImplementingAgencyID,
              ImplementingAgencyName: CreateEmploymentDto.ImplementingAgencyName,
              workAllocationID: CreateEmploymentDto.workAllocationID,
              workerJobCardNo: CreateEmploymentDto.workerJobCardNo,
              workerName: CreateEmploymentDto.workerName,
              workAllocationFromDate: CreateEmploymentDto.workAllocationFromDate,
              workAllocationToDate: CreateEmploymentDto.workAllocationToDate,
              noOfDaysWorkAlloted: CreateEmploymentDto.noOfDaysWorkAlloted,
              totalWagePaid: CreateEmploymentDto.totalWagePaid,
              empProvidedfrom: CreateEmploymentDto.empProvidedfrom,
              empProvidedto: CreateEmploymentDto.empProvidedto,
              dateOfPayment: CreateEmploymentDto.dateOfPayment,
              noOfDaysWorProvided: CreateEmploymentDto.noOfDaysWorProvided,
              currentMonth: CreateEmploymentDto.currentMonth,
              currentYear: CreateEmploymentDto.currentYear,
              finYear: CreateEmploymentDto.finYear,
              attandance: CreateEmploymentDto.attandance,
              userIndex: CreateEmploymentDto.userIndex,
              directempstatus: "N"
          });
      });
  
      const result = await this.employment.save(newWorkAllocations);
      const employment = employmentID;
  
      const workAllocationIDs = createDto.CreateEmploymentDtos.map(dto => dto.workAllocationID);
      const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
      const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
  
      const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);
      const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
      const totalLabourProvided = createDto.CreateEmploymentDtos.length;
  
      // Fetch existing values from masterSchemeRepository
      const schemes = await this.masterSchemeRepository.findByIds(schemeIds);
  
      // Calculate new values
      const updates = schemes.map(scheme => ({
          scheme_sl: scheme.scheme_sl,
          schemeId: scheme.schemeId,
          schemeArea: scheme.schemeArea,
          
          departmentNo: scheme.departmentNo,
          districtcode: scheme.districtcode,
          municipalityCode: scheme.municipalityCode,
          blockcode: scheme.blockcode,
          gpCode: scheme.gpCode,
          sansadID: scheme.sansadID,
          village: scheme.village,
          schemeSector: scheme.schemeSector,
          schemeSubsector: scheme.schemeSubsector,
          schemeName: scheme.schemeName,
          FundingDepttID: scheme.FundingDepttID,
          FundingDeptname: scheme.FundingDeptname,
          ExecutingDepttID: scheme.ExecutingDepttID,
          ExecutingDeptName: scheme.ExecutingDeptName,
          ImplementingAgencyID: scheme.ImplementingAgencyID,
          ImplementingAgencyName: scheme.ImplementingAgencyName,
          StatusOfWork: scheme.StatusOfWork,
          tentativeStartDate: scheme.tentativeStartDate,
          ActualtartDate: scheme.ActualtartDate,
          ExpectedCompletionDate: scheme.ExpectedCompletionDate,
          totalprojectCost: scheme.totalprojectCost,
          totalWageCost: scheme.totalwagescostinvoled,
          finYear: scheme.finYear,
          deptWing: scheme.deptWing,
          totalLabour: scheme.totalLabour,
          personDaysGenerated: scheme.personDaysGenerated,
          totalUnskilledWorkers: scheme.totalUnskilledWorkers,
          totalSemiSkilledWorkers: scheme.totalSemiSkilledWorkers,
          totalSkilledWorkers: scheme.totalSkilledWorkers,
          userIndex: scheme.userIndex,
          totalCostprovided: scheme.totalCostprovided + totalWagePaid,
          totalLabourprovided: scheme.totalLabourprovided + totalLabourProvided,
          personDaysGeneratedprovided: scheme.personDaysGeneratedprovided + personDaysGeneratedProvided,
      }));
  
      // Update WorkAllocation, Demandallotmenthistroy, and masterSchemeRepository records
      await Promise.all([
          this.workallocation.update(
              { workAllocationID: In(workAllocationIDs) },
              { empId: employmentID, empStatus: "1" }
          ),
          this.Demandallotmenthistroy.update(
              { demanduniqueID: In(demanduniqueIDs) },
              { empid: employmentID, empStatus: "1" }
          ),
          ...updates.map(update => 
              this.masterSchemeRepository.update(
                  { schemeId: update.schemeId },
                  {
                      totalCostprovided: update.totalCostprovided,
                      totalLabourprovided: update.totalLabourprovided,
                      personDaysGeneratedprovided: update.personDaysGeneratedprovided,
                  }
              )
          )
      ]);
  
      // Update or create records in MasterSchemeExpendutureRepository
      const currentFinYear = createDto.CreateEmploymentDtos[0].finYear;
      await Promise.all(updates.map(async update => {
          const existingExpenditureRecord = await this.MasterSchemeExpendutureRepository.findOne({
              where: { schemeId: update.scheme_sl, finYear: currentFinYear },
          });
  
          if (existingExpenditureRecord) {
              // Update existing record
              return this.MasterSchemeExpendutureRepository.update(
                  { schemeId: update.scheme_sl, finYear: currentFinYear },
                  {
                      totalWageCost: existingExpenditureRecord.totalWageCost + update.totalCostprovided,
                      totalLabour: existingExpenditureRecord.totalLabour + update.totalLabourprovided,
                      personDaysGenerated: existingExpenditureRecord.personDaysGenerated + update.personDaysGeneratedprovided,
                      totalUnskilledWorkers: existingExpenditureRecord.totalUnskilledWorkers + update.totalLabourprovided,
                  }
              );
          } else {
              // Create a new record for a new financial year
              return this.MasterSchemeExpendutureRepository.save({
                  schemeId: update.scheme_sl,
                  totalWageCost: update.totalCostprovided,
                  totalLabour: update.totalLabourprovided,
                  personDaysGenerated: update.personDaysGeneratedprovided,
                  totalUnskilledWorkers: update.totalLabourprovided,
                  finYear: currentFinYear,
                  schemeArea: update.schemeArea,
                  departmentNo: update.departmentNo,
                  districtcode: update.districtcode,
                  municipalityCode: update.municipalityCode,
                  blockcode: update.blockcode,
                  gpCode: update.gpCode,
                  sansadID: update.sansadID,
                  village: update.village,
                  schemeSector: update.schemeSector,
                  schemeSubsector: update.schemeSubsector,
                  schemeName: update.schemeName,
                  FundingDepttID: update.FundingDepttID,
                  FundingDeptname: update.FundingDeptname,
                  ExecutingDepttID: update.ExecutingDepttID,
                  ExecutingDeptName: update.ExecutingDeptName,
                  ImplementingAgencyID: update.ImplementingAgencyID,
                  ImplementingAgencyName: update.ImplementingAgencyName,
                  StatusOfWork: update.StatusOfWork,
                  tentativeStartDate: update.tentativeStartDate,
                  ActualtartDate: update.ActualtartDate,
                  ExpectedCompletionDate: update.ExpectedCompletionDate,
                  totalprojectCost: update.totalprojectCost,
                
                  deptWing: update.deptWing,
                  totalSemiSkilledWorkers: update.totalSemiSkilledWorkers,
                  totalSkilledWorkers: update.totalSkilledWorkers,
                  userIndex: update.userIndex,
              });
          }
      }));
  
      return {
          errorCode: 0,
          message: "Employment Created Successfully",
          employment,
      };
  }
  
  

    async listWorkAllocations(districtcode?: number,blockcode?: number, gpCode?: number,municipalityCode?: number, schemeId?: number){
        try {
          const queryBuilder = this.workallocation.createQueryBuilder('workAllocation');
    
          if (districtcode) {
            queryBuilder.andWhere('workAllocation.districtcode = :districtcode', { districtcode });
          }
    
          if (blockcode) {
            queryBuilder.andWhere('workAllocation.blockcode = :blockcode', { blockcode });
          }
    
          if (gpCode) {
            queryBuilder.andWhere('workAllocation.gpCode = :gpCode', { gpCode });
          }
    
          if (gpCode) {
            queryBuilder.andWhere('workAllocation.municipalityCode = :municipalityCode', { municipalityCode });
          }
          if (schemeId) {
            queryBuilder.andWhere('workAllocation.schemeId = :schemeId', { schemeId });
          }
    
          const result = await queryBuilder.getMany();
    
          return { errorCode: 0, result };
        } catch (error) {
          return { errorCode: 1,  message: 'Something went wrong', error: error.message };
        }
      }


      async getemploymentList(userIndex: number) {
        try {
            const employments = await this.employment.find({ where: { userIndex },  order: { employmentsl: 'DESC' }  });
    
            if (!employments || employments.length === 0) {
                return {
                    errorCode: 1,
                    message: 'employments not found for the provided user index',
                };
            }
    
            const employmentsWithDetails = [];
    
            await Promise.all(employments.map(async (employment) => {
                try {
                    const districtDetails = await this.getAllDistricts(employment.districtcode);
                    const districtName = districtDetails.result ? districtDetails.result.districtName : '';
    
                    const blockDetails = await this.getAllblock(employment.blockcode);
                    const blockname = blockDetails.result ? blockDetails.result.blockName : '';
    
                    const gpDetails = await this.getAllgp(employment.gpCode);
                    const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
                    const deptDetails = await this.getDepatmentbyid(employment.departmentNo);
                    const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

                    const muniDetails = await this.getmunibyid(employment.municipalityCode);
                    const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

                    const sectorDetails = await this.getSectorbyid(employment.schemeSector);
                    const sectorName = sectorDetails.result ? sectorDetails.result.sectorname : '';
        
    
                    employmentsWithDetails.push({
                        ...employment,
                        districtName: districtName,
                        blockname: blockname,
                        gpName: gpName,
                        deptName: deptName,
                        muniName: muniName,
                        sectorName:sectorName
                    });
                } catch (error) {
                    // Log the error for this contractor
                    console.error(`Failed to fetch details for contractor`);
                }
            }));
    
            return {
                errorCode: 0,
                result: employmentsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch employments from the database:', error);
            throw new Error('Failed to fetch employments from the database.');
        }
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
    
async getScheme(scheme_sl: number) {
  try {
    // Use `findOne` to retrieve a single record
    const contractor = await this.masterSchemeRepository.findOne({ where: { scheme_sl } });

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


      async getSectorbyid(sectorid: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.mastersector.findOne({ where: { sectorid },  select: ["sectorname","sectorid"] });
        
      
       
      
          return { errorCode: 0, result: dept };
    
         
        }

        private async generateWorkAllocationID(departmentName: number) {
          const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
          return `${departmentName}${random8Digits}`;
      }  
      private generateEMPID2(): string {
        const random6Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
        return `REQ${random6Digits}`;
      }
      
//       async creatediretemp(createDto: EmploymentDto) {
//         try {
//           const employmentID = this.generateEMPID();
//           const newWorkAllocations = [];
//           const workAllocationIDs = [];
//           const newRequsitions = [];
  
//           for (const employmentDto of createDto.CreateEmploymentDtos) {
//               const masterWorker = this.masterWorkerRequirement.create({
//                   gpCode: employmentDto.gpCode || null,
//                   workCodeSchemeID: employmentDto.schemeId || null,
//                   ContractorID: employmentDto.ContractorID || null,
//                   currentMonth: employmentDto.currentMonth || null,
//                   FundingDeptname: employmentDto.FundingDeptname || null,
//                   departmentNo: employmentDto.departmentNo || null,
//                   districtcode: employmentDto.districtcode || null,
//                   municipalityCode: employmentDto.municipalityCode || null,
//                   fromDate:employmentDto.workAllocationFromDate||null,
//                   blockcode: employmentDto.blockcode || null,
//                   noOfDays: employmentDto.noOfDaysWorkDemanded || null,
//                   currentYear: employmentDto.currentYear || null,
//                   userIndex: employmentDto.userIndex || null,
//                   schemeArea: employmentDto.schemeArea || null,
//                   finYear: employmentDto.finYear || null,
//                   contactPersonName: null,
//                   contactPersonPhoneNumber: null,
//               });
  
//               const randomNum = this.generateEMPID2();
//               masterWorker.workerreqID = randomNum;
  
//               const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
  
//               const masterAllotment: MasterWorkerRequirement_allotment[] = [];
//               const gpCode = masterWorker.gpCode;
//               const workCodeSchemeID = masterWorker.workCodeSchemeID;
//               const contractorID = masterWorker.ContractorID;
//               const currentMonthWork = masterWorker.currentMonth;
//               const workerreqID = savedMasterScheme.workerreqID;


//               for (const createWorkAllotDto of createDto.CreateEmploymentDtos) {
//                 const fromDate = new Date(employmentDto.workAllocationFromDate);
//                 const toDate = addDays(fromDate, employmentDto.noOfDaysWorkDemanded);
    
//                 // Iterate over each day within the range
//                 for (let currentDate = fromDate; currentDate <= toDate; currentDate = addDays(currentDate, 1)) {
          
//                   const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
//                       workerreqID: workerreqID,
//                       skilledWorkers: createWorkAllotDto.skilledWorkers,
//                       unskilledWorkers: createWorkAllotDto.unskilledWorkers,
//                       semiSkilledWorkers: createWorkAllotDto.semiSkilledWorkers,
//                       dateofwork: createWorkAllotDto.workAllocationFromDate,
//                       FundingDeptname: masterWorker.FundingDeptname,
//                       gpCode: gpCode,
//                       workCodeSchemeID: workCodeSchemeID,
//                       contractorID: contractorID,
//                       currentMonthWork: currentMonthWork,
//                       departmentNo: masterWorker.departmentNo,
//                       districtcode: masterWorker.districtcode,
//                       municipalityCode: masterWorker.municipalityCode,
//                       blockcode: masterWorker.blockcode,
//                       currentYearWork: masterWorker.currentYear,
//                       userIndex: masterWorker.userIndex,
//                       schemeArea: masterWorker.schemeArea,
//                       finYearWork: masterWorker.finYear,
//                       contactPersonName: masterWorker.contactPersonName,
//                       contactPersonPhoneNumber: masterWorker.contactPersonPhoneNumber,
//                   });
  
//                   await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment);
//                   masterAllotment.push(newMasterWorkerAllotment);
//                   ///console.log(newMasterWorkerAllotment);
//               }
//             }
//               const existingRecords = await this.masterWorkerRequirementallotment.find({
//                   where: { workerreqID: workerreqID }
//               });
  
//               // Calculate total unskilled workers and current time
//               const totalUnskilledWorkers = createDto.CreateEmploymentDtos.length;
//               const submitTime = new Date();
  
//               // Ensure that the workAllocationID is correctly set
//               const newWorkAllocationID = await this.generateWorkAllocationID(employmentDto.departmentNo);
  
//               // Update each existing record
//               for (const existingRecord of existingRecords) {
// //console.log(existingRecord);
//                   await this.masterWorkerRequirementallotment.update(
//                       { workersl: existingRecord.workersl },
//                       {
//                           allocationID: newWorkAllocationID,
//                           allotmentuserIndex: createDto.CreateEmploymentDtos[0].userIndex,
//                           dateofallotment: submitTime,
//                           noUnskilledWorkers: totalUnskilledWorkers,
//                           currentMonthAllot: createDto.CreateEmploymentDtos[0].currentMonth,
//                           currentYearAllot: createDto.CreateEmploymentDtos[0].currentYear,
//                           finYearAllot: createDto.CreateEmploymentDtos[0].finYear,
//                       }
//                   );
//               }
//               const department = await this.getDepatmentbyid( createDto.CreateEmploymentDtos[0].departmentNo);
//               const departmentName = department.result?.deptshort|| '';
//               //console.log(departmentName)
//              // console.log(createDto.CreateEmploymentDtos[0].departmentNo)
//               // Generate the work allocation ID using the department name
//               const workAllocationID = await this.generateWorkAllocationID(departmentName);
//               // Create and save WorkAllocation record
//               const newWorkAllocation = this.workallocation.create({
//                   workAllocationID: workAllocationID,
//                   schemeArea: employmentDto.schemeArea,
//                   departmentNo: employmentDto.departmentNo,
//                   districtcode: employmentDto.districtcode,
//                   municipalityCode: employmentDto.municipalityCode,
//                   blockcode: employmentDto.blockcode,
//                   gpCode: employmentDto.gpCode,
//                   workerJobCardNo: employmentDto.workerJobCardNo,
//                   workerName: employmentDto.workerName,
//                   workallocstatus: "1",
                 
//                   noOfDaysWorkAlloted: employmentDto.noOfDaysWorkAlloted,
//                   workAllocationFromDate: employmentDto.workAllocationFromDate,
//                   workAllocationToDate: employmentDto.workAllocationToDate,
//                   currentMonth: employmentDto.currentMonth,
//                   currentYear: employmentDto.currentYear,
//                   finYear: employmentDto.finYear,
//                   userIndex: employmentDto.userIndex,
//                   demanduniqueID: employmentDto.demandid,
//                   schemeId: employmentDto.scheme_Id,
//                   schemeName:  employmentDto.schemeName,
//                   dateOfApplicationForWork: employmentDto.dateOfApplicationForWork,
//                   noOfDaysWorkDemanded: employmentDto.noOfDaysWorkDemanded
//               });
  
//               await this.workallocation.save(newWorkAllocation);
//               workAllocationIDs.push(newWorkAllocationID);
  
//               const workerJobCardNos = createDto.CreateEmploymentDtos.map(dto => dto.workerJobCardNo);
//               const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
  
//               // Fetch and update records in DemandMaster
//               const demandMasterRecords = await this.demandMaster.find({
//                   where: {
//                       workerJobCardNo: In(workerJobCardNos),
//                       demanduniqueID: In(demanduniqueIDs)
//                   },
//               });
  
//               // Calculate the total work days for each job card number and demand unique ID
//               const totalWorkDaysMap = new Map();
  
//               for (let i = 0; i < createDto.CreateEmploymentDtos.length; i++) {
//                   const workAllocationDto = createDto.CreateEmploymentDtos[i];
//                   const key = `${workAllocationDto.workerJobCardNo}-${workAllocationDto.demandid}`;
//                   const startDate = new Date(workAllocationDto.workAllocationFromDate);
//                   const endDate = new Date(workAllocationDto.workAllocationToDate);
//                   const workDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  
//                   if (totalWorkDaysMap.has(key)) {
//                       totalWorkDaysMap.set(key, totalWorkDaysMap.get(key) + workDays);
//                   } else {
//                       totalWorkDaysMap.set(key, workDays);
//                   }
  
//                   const newAllotment = this.Demandallotmenthistroy.create({
//                       allotmentuserIndex: workAllocationDto.userIndex,
//                       allocationID: workAllocationID,
//                       workerJobCardNo: workAllocationDto.workerJobCardNo,
//                       demanduniqueID: workAllocationDto.demandid,
//                       workAllotedstatus: "1",
//                       finYear_work: workAllocationDto.finYear,
//                       CurrentMonth_allot: workAllocationDto.currentMonth,
//                       CurrentYear_allot: workAllocationDto.currentYear,
//                       finYear_allot: workAllocationDto.finYear,
//                       dateofallotmentfrom: workAllocationDto.workAllocationFromDate,
//                       dateofallotmentto: workAllocationDto.workAllocationToDate,
//                   });
//                   await this.Demandallotmenthistroy.save(newAllotment);
//               }
  
//               for (let i = 0; i < createDto.CreateEmploymentDtos.length; i++) {
//                   const workAllocationDto = createDto.CreateEmploymentDtos[i];
//                   const key = `${workAllocationDto.workerJobCardNo}-${workAllocationDto.demandid}`;
//                   const totalWorkDays = totalWorkDaysMap.get(key);
  
//                   const matchingDemandMaster = demandMasterRecords.find(record =>
//                       record.workerJobCardNo === workAllocationDto.workerJobCardNo &&
//                       record.demanduniqueID === workAllocationDto.demandid
//                   );
  
//                   if (matchingDemandMaster) {
//                       if (matchingDemandMaster.workallostatus === "0") {
//                           matchingDemandMaster.total_pending = workAllocationDto.noOfDaysWorkDemanded - totalWorkDays;
//                           matchingDemandMaster.total_pending = Math.max(matchingDemandMaster.total_pending, 0);
//                           matchingDemandMaster.workallostatus = "1";
//                       } else if (matchingDemandMaster.workallostatus === "1") {
//                           matchingDemandMaster.total_pending -= workAllocationDto.noOfDaysWorkAlloted;
//                           matchingDemandMaster.total_pending = Math.max(matchingDemandMaster.total_pending, 0);
//                       }
//                       matchingDemandMaster.dateoflastallocation = workAllocationDto.workAllocationToDate;
  
//                       await this.demandMaster.save(matchingDemandMaster);
//                   } else {
//                       console.log("No matching record found for:", {
//                           workerJobCardNo: workAllocationDto.workerJobCardNo,
//                           demanduniqueID: workAllocationDto.demandid,
//                       });
//                   }
//               }
          
            
                         
//                 // Prepare the Employment record
//                 const newEmployment = this.employment.create({
//                     employmentID,
//                     schemeArea: employmentDto.schemeArea,
//                     departmentNo: employmentDto.departmentNo,
//                     districtcode: employmentDto.districtcode,
//                     municipalityCode: employmentDto.municipalityCode,
//                     blockcode: employmentDto.blockcode,
//                     gpCode: employmentDto.gpCode,
//                     schemeId: employmentDto.schemeId,
//                     demandid: employmentDto.demandid,
//                     schemeSector: employmentDto.schemeSector,
//                     FundingDepttID: employmentDto.FundingDepttID,
//                     FundingDeptname: employmentDto.FundingDeptname,
//                     ExecutingDepttID: employmentDto.ExecutingDepttID,
//                     ExecutingDeptName: employmentDto.ExecutingDeptName,
//                     ImplementingAgencyID: employmentDto.ImplementingAgencyID,
//                     ImplementingAgencyName: employmentDto.ImplementingAgencyName,
//                     workAllocationID:workAllocationID,
//                     workerJobCardNo: employmentDto.workerJobCardNo,
//                     workerName: employmentDto.workerName,
//                     workAllocationFromDate: employmentDto.workAllocationFromDate,
//                     workAllocationToDate: employmentDto.workAllocationToDate,
//                     noOfDaysWorkAlloted: employmentDto.noOfDaysWorkAlloted,
//                     totalWagePaid: employmentDto.totalWagePaid,
//                     empProvidedfrom: employmentDto.empProvidedfrom,
//                     empProvidedto: employmentDto.empProvidedto,
//                     dateOfPayment: employmentDto.dateOfPayment,
//                     noOfDaysWorProvided: employmentDto.noOfDaysWorProvided,
//                     currentMonth: employmentDto.currentMonth,
//                     currentYear: employmentDto.currentYear,
//                     finYear: employmentDto.finYear,
//                     attandance: employmentDto.attandance,
//                     userIndex: employmentDto.userIndex,
//                       directempstatus:"Y",
//                 });
//                 newWorkAllocations.push(newEmployment);
//             }
    
//             // Save all Employment records
//             const result = await this.employment.save(newWorkAllocations);
    
//             // Backtrack calculations
//             const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
//             const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
//             const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);
//             const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
//             const totalLabourProvided = createDto.CreateEmploymentDtos.length;
    
//             const schemes = await this.masterSchemeRepository.findByIds(schemeIds);
//             const updates = schemes.map(scheme => ({
//               scheme_sl:scheme.scheme_sl,
//                 schemeId: scheme.schemeId,
//                 totalCostprovided: scheme.totalCostprovided + totalWagePaid,
//                 totalLabourprovided: scheme.totalLabourprovided + totalLabourProvided,
//                 personDaysGeneratedprovided: scheme.personDaysGeneratedprovided + personDaysGeneratedProvided,
//             }));
    
//             await Promise.all([
//                 this.workallocation.update(
//                     { workAllocationID: In(workAllocationIDs) },
//                     { empId: employmentID, empStatus: "1" }
//                 ),
//                 this.Demandallotmenthistroy.update(
//                     { demanduniqueID: In(demanduniqueIDs) },
//                     { empid: employmentID, empStatus: "1" }
//                 ),
//                 ...updates.map(update =>
//                     this.masterSchemeRepository.update(
//                         { schemeId: update.schemeId },
//                         {
//                             totalCostprovided: update.totalCostprovided,
//                             totalLabourprovided: update.totalLabourprovided,
//                             personDaysGeneratedprovided: update.personDaysGeneratedprovided,
//                         }
//                     )
//                 )
//                  ,   
//               ...updates.map(update => 
//               this.MasterSchemeExpendutureRepository.update(
//                 { schemeId: update.scheme_sl },
//                 {
    
                  
      
//         totalWageCost: update.totalCostprovided,
    
    
//         totalLabour:update.totalLabourprovided,
    
     
//         personDaysGenerated:update.personDaysGeneratedprovided,
    
      
//         totalUnskilledWorkers: update.totalLabourprovided,
    
//                 }
//             )
//           )
//           ]);
      
//             return {
//                 errorCode: 0,
//                 message: "Employment Created Successfully",
//                 employment: employmentID,
//             };
//         } catch (error) {
//             return {
//                 errorCode: 1,
//                 message: "Something went wrong: " + error.message,
//             };
//         }
//     }
    
 
async creatediretemp(createDto: EmploymentDto) {
    try {
        const employmentID = this.generateEMPID();
        const newWorkAllocations = [];
        const workAllocationIDs = [];
        const newRequisitions = [];
        const totalWorkDaysMap = new Map();

        for (const employmentDto of createDto.CreateEmploymentDtos) {
            const masterWorker = this.masterWorkerRequirement.create({
                gpCode: employmentDto.gpCode || null,
                workCodeSchemeID: employmentDto.schemeId || null,
                ContractorID: employmentDto.ContractorID || null,
                currentMonth: employmentDto.currentMonth || null,
                FundingDeptname: employmentDto.FundingDeptname || null,
                departmentNo: employmentDto.departmentNo || null,
                districtcode: employmentDto.districtcode || null,
                municipalityCode: employmentDto.municipalityCode || null,
                fromDate: employmentDto.workAllocationFromDate || null,
                blockcode: employmentDto.blockcode || null,
                noOfDays: employmentDto.noOfDaysWorkDemanded || null,
                currentYear: employmentDto.currentYear || null,
                userIndex: employmentDto.userIndex || null,
                schemeArea: employmentDto.schemeArea || null,
                finYear: employmentDto.finYear || null,
                contactPersonName: null,
                contactPersonPhoneNumber: null,
            });

            const randomNum = this.generateEMPID2();
            masterWorker.workerreqID = randomNum;

            const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
            const workerreqID = savedMasterScheme.workerreqID;

            const fromDate = new Date(employmentDto.workAllocationFromDate);
            const toDate = new Date(employmentDto.workAllocationToDate);

            // Iterate over each day within the range
            for (let currentDate = fromDate; currentDate <= toDate; currentDate = this.addDays(currentDate, 1)) {
                const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
                    workerreqID: workerreqID,
                    skilledWorkers: employmentDto.skilledWorkers,
                    unskilledWorkers: employmentDto.unskilledWorkers,
                    semiSkilledWorkers: employmentDto.semiSkilledWorkers,
                    dateofwork: currentDate,
                    FundingDeptname: masterWorker.FundingDeptname,
                    gpCode: masterWorker.gpCode,
                    workCodeSchemeID: masterWorker.workCodeSchemeID,
                    contractorID: masterWorker.ContractorID,
                    currentMonthWork: masterWorker.currentMonth,
                    departmentNo: masterWorker.departmentNo,
                    districtcode: masterWorker.districtcode,
                    municipalityCode: masterWorker.municipalityCode,
                    blockcode: masterWorker.blockcode,
                    currentYearWork: masterWorker.currentYear,
                    userIndex: masterWorker.userIndex,
                    schemeArea: masterWorker.schemeArea,
                    finYearWork: masterWorker.finYear,
                    contactPersonName: masterWorker.contactPersonName,
                    contactPersonPhoneNumber: masterWorker.contactPersonPhoneNumber,
                });

                await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment);
            }

            const newWorkAllocationID = await this.generateWorkAllocationID(employmentDto.departmentNo);
            workAllocationIDs.push(newWorkAllocationID);

            const key = `${employmentDto.workerJobCardNo}-${employmentDto.demandid}`;
            const workDays = this.calculateWorkDays(fromDate, toDate);

            if (totalWorkDaysMap.has(key)) {
                totalWorkDaysMap.set(key, totalWorkDaysMap.get(key) + workDays);
            } else {
                totalWorkDaysMap.set(key, workDays);
            }

            const newWorkAllocation = this.workallocation.create({
                workAllocationID: newWorkAllocationID,
                schemeArea: employmentDto.schemeArea,
                departmentNo: employmentDto.departmentNo,
                districtcode: employmentDto.districtcode,
                municipalityCode: employmentDto.municipalityCode,
                blockcode: employmentDto.blockcode,
                gpCode: employmentDto.gpCode,
                workerJobCardNo: employmentDto.workerJobCardNo,
                workerName: employmentDto.workerName,
                workallocstatus: "1",
                noOfDaysWorkAlloted: employmentDto.noOfDaysWorkAlloted,
                workAllocationFromDate: employmentDto.workAllocationFromDate,
                workAllocationToDate: employmentDto.workAllocationToDate,
                currentMonth: employmentDto.currentMonth,
                currentYear: employmentDto.currentYear,
                finYear: employmentDto.finYear,
                userIndex: employmentDto.userIndex,
                demanduniqueID: employmentDto.demandid,
                schemeId: employmentDto.scheme_Id,
                schemeName: employmentDto.schemeName,
                dateOfApplicationForWork: employmentDto.dateOfApplicationForWork,
                noOfDaysWorkDemanded: employmentDto.noOfDaysWorkDemanded,
            });

            await this.workallocation.save(newWorkAllocation);

            newWorkAllocations.push({
                workerJobCardNo: employmentDto.workerJobCardNo,
                demanduniqueID: employmentDto.demandid,
                totalWorkDaysMap,
            });
        }

        // Update DemandMaster records
        const workerJobCardNos = createDto.CreateEmploymentDtos.map(dto => dto.workerJobCardNo);
        const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);

        const demandMasterRecords = await this.demandMaster.find({
            where: {
                workerJobCardNo: In(workerJobCardNos),
                demanduniqueID: In(demanduniqueIDs),
            },
        });

        for (const record of demandMasterRecords) {
            const key = `${record.workerJobCardNo}-${record.demanduniqueID}`;
            const totalWorkDays = totalWorkDaysMap.get(key);

            if (record.workallostatus === "0") {
                record.total_pending = Math.max(record.total_pending - totalWorkDays, 0);
                record.workallostatus = "1";
            } else if (record.workallostatus === "1") {
                record.total_pending = Math.max(record.total_pending - totalWorkDays, 0);
            }

            record.dateoflastallocation = new Date();

            await this.demandMaster.save(record);
        }

        // Save Employment records
        const result = await this.employment.save(newWorkAllocations);

        // Backtrack calculations and updates
        const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);
        const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
        const totalLabourProvided = createDto.CreateEmploymentDtos.length;

        const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
        const schemes = await this.masterSchemeRepository.findByIds(schemeIds);

        const updates = schemes.map(scheme => ({
            scheme_sl: scheme.scheme_sl,
            schemeId: scheme.schemeId,
            totalCostprovided: scheme.totalCostprovided + totalWagePaid,
            totalLabourprovided: scheme.totalLabourprovided + totalLabourProvided,
            personDaysGeneratedprovided: scheme.personDaysGeneratedprovided + personDaysGeneratedProvided,
        }));

        await Promise.all([
            this.workallocation.update(
                { workAllocationID: In(workAllocationIDs) },
                { empId: employmentID, empStatus: "1" }
            ),
            this.Demandallotmenthistroy.update(
                { demanduniqueID: In(demanduniqueIDs) },
                { empid: employmentID, empStatus: "1" }
            ),
            ...updates.map(update =>
                this.masterSchemeRepository.update(
                    { schemeId: update.schemeId },
                    {
                        totalCostprovided: update.totalCostprovided,
                        totalLabourprovided: update.totalLabourprovided,
                        personDaysGeneratedprovided: update.personDaysGeneratedprovided,
                    }
                )
            ),
            ...updates.map(update =>
                this.MasterSchemeExpendutureRepository.update(
                    { schemeId: update.scheme_sl },
                    {
                        totalWageCost: update.totalCostprovided,
                        totalLabour: update.totalLabourprovided,
                        personDaysGenerated: update.personDaysGeneratedprovided,
                        totalUnskilledWorkers: update.totalLabourprovided,
                    }
                )
            )
        ]);

        return {
            errorCode: 0,
            message: "Employment Created Successfully",
            employmentID: employmentID,
        };
    } catch (error) {
        console.error("Error creating employment:", error);
        throw new Error("Failed to create employment");
    }
}

// Utility function to calculate work days
private calculateWorkDays(fromDate: Date, toDate: Date): number {
    return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
}

// Utility function to add days to a date
private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}



  async getEmploymentSummary(): Promise<any> {
    return await this.employment.query(`
      SELECT 
        md.departmentName,
        md.departmentNo,
        COUNT(DISTINCT scheme.districtcode) AS 'No. of Districts where schemes are running',
        COUNT(
            CASE WHEN scheme.StatusOfWork = "S" THEN 1
        END) AS 'Total no. of On-going Schemes where Job Card holders are Employed',
        COUNT(DISTINCT emp.workerJobCardNo,emp.workerName) AS 'Total no. of On-going Schemes where Job Card holders are Employed',
     COALESCE(SUM(scheme_exp.totalWageCost), 0) AS 'Total Wage Paid',
    COALESCE(SUM(scheme_exp.personDaysGenerated), 0) AS 'Total no. of Persondays generated',
    COALESCE(AVG(emp.noOfDaysWorkAlloted), 0) AS 'Avg. Days of Employment per Unique Household',
    COALESCE(AVG(scheme_exp.personDaysGenerated), 0) AS Persondays_generated
      FROM masterdepartment md
      LEFT JOIN master_scheme scheme ON md.departmentNo = scheme.FundingDepttID AND scheme.finYear = '2024-2025'
      LEFT JOIN master_scheme_expenduture scheme_exp ON scheme.scheme_sl = scheme_exp.schemeId AND scheme_exp.finYear = '2024-2025'
      LEFT JOIN employment emp ON scheme.scheme_sl = emp.schemeId AND emp.finYear = '2024-2025'
      GROUP BY emp.departmentNo, md.departmentName
      ORDER BY md.departmentName ASC;
    `);
  }


  async getExecuting_Department(): Promise<any> {
    return await this.employment.query(`
     SELECT 
    md.departmentName AS 'Executing Department',
    md.departmentNo,
    COUNT(DISTINCT scheme.districtcode) AS 'No. of Districts where schemes are running',
    COUNT(
        CASE WHEN scheme.StatusOfWork = "S" THEN 1
    END) AS 'Total no. of On-going Schemes where Job Card holders are Employed',
    COUNT(DISTINCT emp.workerJobCardNo,emp.workerName) AS 'Total no. of On-going Schemes where Job Card holders are Employed',
 COALESCE(SUM(scheme_exp.totalWageCost), 0) AS 'Total Wage Paid',
    COALESCE(SUM(scheme_exp.personDaysGenerated), 0) AS 'Total no. of Persondays generated',
    COALESCE(AVG(emp.noOfDaysWorkAlloted), 0) AS 'Avg. Days of Employment per Unique Household',
    COALESCE(AVG(scheme_exp.personDaysGenerated), 0) AS Persondays_generated
FROM masterdepartment md
LEFT JOIN master_scheme scheme ON md.departmentNo = scheme.ExecutingDepttID AND scheme.finYear = '2024-2025'
LEFT JOIN master_scheme_expenduture scheme_exp ON scheme.scheme_sl = scheme_exp.schemeId AND scheme_exp.finYear = '2024-2025'
LEFT JOIN employment emp ON scheme.scheme_sl = emp.schemeId AND emp.finYear = '2024-2025'
GROUP BY md.departmentNo, md.departmentName
ORDER BY md.departmentName ASC
    `);
  }
}

  
    

