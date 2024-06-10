import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employment } from 'src/entity/employment.entity';
import { In, Repository } from 'typeorm';
import { CreateEmploymentDto, EmploymentDto } from './dto/employment.dto';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';
import { MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';

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
      return `EMP${random6Digits}`;
    }
    async create(createDto: EmploymentDto) {
      const employmentID = this.generateEMPID();
      
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
              empProvidedfrom:CreateEmploymentDto.empProvidedfrom,
              empProvidedto: CreateEmploymentDto.empProvidedto,
              dateOfPayment: CreateEmploymentDto.dateOfPayment,
              noOfDaysWorProvided:CreateEmploymentDto.noOfDaysWorProvided,
              
              currentMonth: CreateEmploymentDto.currentMonth,
              currentYear: CreateEmploymentDto.currentYear,
              finYear: CreateEmploymentDto.finYear,
              attandance: CreateEmploymentDto.attandance,
              userIndex: CreateEmploymentDto.userIndex,
          });
      });
  
      const result = await this.employment.save(newWorkAllocations);
      const employment = employmentID;
  
      const workAllocationIDs = createDto.CreateEmploymentDtos.map(dto => dto.workAllocationID);
      const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
      const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
  
      const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);


     // const totalUnskilledWorkers = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalUnskilledWorkers, 0);
      //const totalLabourProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalLabourprovided, 0);
      const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
      const totalLabourProvided = createDto.CreateEmploymentDtos.map(_ => 1).reduce((sum, count) => sum + count, 0);

      // Fetch existing values from masterSchemeRepository
      const schemes = await this.masterSchemeRepository.findByIds(schemeIds);
  
      // Calculate new values
      const updates = schemes.map(scheme => ({
        scheme_sl:scheme.scheme_sl,
          schemeId: scheme.schemeId,
          //totalUnskilledWorkers: scheme.totalUnskilledWorkers + totalUnskilledWorkers,
          totalCostprovided: scheme.totalCostprovided + totalWagePaid,
          totalLabourprovided: scheme.totalLabourprovided + totalLabourProvided,
          personDaysGeneratedprovided: scheme.personDaysGeneratedprovided + personDaysGeneratedProvided,
      }));
  
      // Update WorkAllocation, Demandallotmenthistroy and masterSchemeRepository records
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
              
          )   ,   
          ...updates.map(update => 
          this.MasterSchemeExpendutureRepository.update(
            { schemeId: update.scheme_sl },
            {

              
  
    totalWageCost: update.totalCostprovided,


    totalLabour:update.totalLabourprovided,

 
    personDaysGenerated:update.personDaysGeneratedprovided,

  
    totalUnskilledWorkers: update.totalLabourprovided,

            }
        )
      )
      ]);
  
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

        private async generateWorkAllocationID(departmentName: number) {
          const random8Digits = Math.floor(10000000 + Math.random() * 90000000).toString();
          return `${departmentName}${random8Digits}`;
      }  
      
      async creatediretemp(createDto: EmploymentDto) {
        try {
            const employmentID = this.generateEMPID();
            const newWorkAllocations = [];
            const workAllocationIDs = [];
    
            for (const CreateEmploymentDto of createDto.CreateEmploymentDtos) {
                const workAllocationID = await this.generateWorkAllocationID(CreateEmploymentDto.departmentNo);
    
                // Create and save WorkAllocation record
                const newWorkAllocation = this.workallocation.create({
                    workAllocationID,
                    schemeArea: CreateEmploymentDto.schemeArea,
                    departmentNo: CreateEmploymentDto.departmentNo,
                    districtcode: CreateEmploymentDto.districtcode,
                    municipalityCode: CreateEmploymentDto.municipalityCode,
                    blockcode: CreateEmploymentDto.blockcode,
                    gpCode: CreateEmploymentDto.gpCode,
                    workerJobCardNo: CreateEmploymentDto.workerJobCardNo,
                    workerName: CreateEmploymentDto.workerName,
                    workallocstatus: "allocated",
                    noOfDaysWorkAlloted: CreateEmploymentDto.noOfDaysWorkAlloted,
                    workAllocationFromDate: CreateEmploymentDto.workAllocationFromDate,
                    workAllocationToDate: CreateEmploymentDto.workAllocationToDate,
                    currentMonth: CreateEmploymentDto.currentMonth,
                    currentYear: CreateEmploymentDto.currentYear,
                    finYear: CreateEmploymentDto.finYear,
                    userIndex: CreateEmploymentDto.userIndex,
                    demanduniqueID: CreateEmploymentDto.demandid,
                   schemeId: "2",
                   schemeName: "dd",
                   dateOfApplicationForWork:CreateEmploymentDto.dateOfApplicationForWork,
                   noOfDaysWorkDemanded:CreateEmploymentDto.noOfDaysWorkDemanded
                });

                await this.workallocation.save(newWorkAllocation);
                workAllocationIDs.push(workAllocationID);
    
                // Prepare the Employment record
                const newEmployment = this.employment.create({
                    employmentID,
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
                    workAllocationID,
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
                });
                newWorkAllocations.push(newEmployment);
            }
    
            // Save all Employment records
            const result = await this.employment.save(newWorkAllocations);
    
            // Backtrack calculations
            const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
            const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
            const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);
            const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
            const totalLabourProvided = createDto.CreateEmploymentDtos.length;
    
            const schemes = await this.masterSchemeRepository.findByIds(schemeIds);
            const updates = schemes.map(scheme => ({
              scheme_sl:scheme.scheme_sl,
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
                )
                 ,   
              ...updates.map(update => 
              this.MasterSchemeExpendutureRepository.update(
                { schemeId: update.scheme_sl },
                {
    
                  
      
        totalWageCost: update.totalCostprovided,
    
    
        totalLabour:update.totalLabourprovided,
    
     
        personDaysGenerated:update.personDaysGeneratedprovided,
    
      
        totalUnskilledWorkers: update.totalLabourprovided,
    
                }
            )
          )
          ]);
      
            return {
                errorCode: 0,
                message: "Employment Created Successfully",
                employment: employmentID,
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong: " + error.message,
            };
        }
    }
    
 
    


  //   async creatediretemp(createDto: EmploymentDto) {
  //     try {
  //         const employmentID = this.generateEMPID();
  //         const newWorkAllocations = [];
  //         const workAllocationIDs = [];
  
  //         for (const employmentDto of createDto.CreateEmploymentDtos) {
  //             const workAllocationID = await this.generateWorkAllocationID(employmentDto.departmentNo);
  
  //             // Create and save WorkAllocation record
  //             const newWorkAllocation = this.workallocation.create({
  //                 workAllocationID,
  //                 schemeArea: employmentDto.schemeArea,
  //                 departmentNo: employmentDto.departmentNo,
  //                 districtcode: employmentDto.districtcode,
  //                 municipalityCode: employmentDto.municipalityCode,
  //                 blockcode: employmentDto.blockcode,
  //                 gpCode: employmentDto.gpCode,
  //                 workerJobCardNo: employmentDto.workerJobCardNo,
  //                 workerName: employmentDto.workerName,
  //                 workallocstatus: "allocated",
  //                 noOfDaysWorkAlloted: employmentDto.noOfDaysWorkAlloted,
  //                 workAllocationFromDate: employmentDto.workAllocationFromDate,
  //                 workAllocationToDate: employmentDto.workAllocationToDate,
  //                 currentMonth: employmentDto.currentMonth,
  //                 currentYear: employmentDto.currentYear,
  //                 finYear: employmentDto.finYear,
  //                 userIndex: employmentDto.userIndex,
  //                 demanduniqueID: employmentDto.demandid,
  //                 schemeId: "2",
  //                 schemeName: "dd",
  //                 dateOfApplicationForWork: employmentDto.dateOfApplicationForWork,
  //                 noOfDaysWorkDemanded: employmentDto.noOfDaysWorkDemanded
  //             });
  
  //             await this.workallocation.save(newWorkAllocation);
  //             workAllocationIDs.push(workAllocationID);
  
  //             // Create MasterWorkerRequirement if applicable
  //             if (employmentDto.createWorkerRequirementDto) {
  //                 const masterWorker = this.masterWorkerRequirement.create({
  //                     gpCode: employmentDto.gpCode || null,
  //                     workCodeSchemeID: employmentDto.schemeId || null,
  //                     ContractorID: employmentDto.ContractorID || null,
  //                     currentMonth: employmentDto.currentMonth || null,
  //                     FundingDeptname: employmentDto.FundingDeptname || null,
  //                     departmentNo: employmentDto.departmentNo || null,
  //                     districtcode: employmentDto.districtcode || null,
  //                     municipalityCode: employmentDto.municipalityCode || null,
  //                     blockcode: employmentDto.blockcode || null,
  //                     currentYear: employmentDto.currentYear || null,
  //                     userIndex: employmentDto.userIndex || null,
  //                     schemeArea: employmentDto.schemeArea || null,
  //                     finYear: employmentDto.finYear || null,
  //                     contactPersonName:  null,
  //                     contactPersonPhoneNumber:  null,
  //                 });
  
  //                 const randomNum = this.generateEMPID();
  //                 masterWorker.workerreqID = randomNum;
  
  //                 const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
  
  //                 const masterAllotment: MasterWorkerRequirement_allotment[] = [];
  //                 const gpCode = masterWorker.gpCode;
  //                 const workCodeSchemeID = masterWorker.workCodeSchemeID;
  //                 const contractorID = masterWorker.ContractorID;
  //                 const currentMonthWork = masterWorker.currentMonth;
  
  //                 for (const createWorkAllotDto of employmentDto.createWorkerRequirementDto.createworkalloDto) {
  //                     const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
  //                         workerreqID: savedMasterScheme.workerreqID,
  //                         skilledWorkers: createWorkAllotDto.skilledWorkers,
  //                         unskilledWorkers: createWorkAllotDto.unskilledWorkers,
  //                         semiSkilledWorkers: createWorkAllotDto.semiSkilledWorkers,
  //                         dateofwork: createWorkAllotDto.dateofwork,
  //                         FundingDeptname: masterWorker.FundingDeptname,
  //                         gpCode: gpCode,
  //                         workCodeSchemeID: workCodeSchemeID,
  //                         contractorID: contractorID,
  //                         currentMonthWork: currentMonthWork,
  //                         departmentNo: masterWorker.departmentNo,
  //                         districtcode: masterWorker.districtcode,
  //                         municipalityCode: masterWorker.municipalityCode,
  //                         blockcode: masterWorker.blockcode,
  //                         currentYearWork: masterWorker.currentYear,
  //                         userIndex: masterWorker.userIndex,
  //                         schemeArea: masterWorker.schemeArea,
  //                         finYearWork: masterWorker.finYear,
  //                         contactPersonName: masterWorker.contactPersonName,
  //                         contactPersonPhoneNumber: masterWorker.contactPersonPhoneNumber,
  //                     });
  
  //                     await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment);
  //                     masterAllotment.push(newMasterWorkerAllotment);
  //                 }
  //             }
  
  //             // Prepare the Employment record
  //             const newEmployment = this.employment.create({
  //                 employmentID,
  //                 schemeArea: employmentDto.schemeArea,
  //                 departmentNo: employmentDto.departmentNo,
  //                 districtcode: employmentDto.districtcode,
  //                 municipalityCode: employmentDto.municipalityCode,
  //                 blockcode: employmentDto.blockcode,
  //                 gpCode: employmentDto.gpCode,
  //                 schemeId: employmentDto.schemeId,
  //                 demandid: employmentDto.demandid,
  //                 schemeSector: employmentDto.schemeSector,
  //                 FundingDepttID: employmentDto.FundingDepttID,
  //                 FundingDeptname: employmentDto.FundingDeptname,
  //                 ExecutingDepttID: employmentDto.ExecutingDepttID,
  //                 ExecutingDeptName: employmentDto.ExecutingDeptName,
  //                 ImplementingAgencyID: employmentDto.ImplementingAgencyID,
  //                 ImplementingAgencyName: employmentDto.ImplementingAgencyName,
  //                 workAllocationID,
  //                 workerJobCardNo: employmentDto.workerJobCardNo,
  //                 workerName: employmentDto.workerName,
  //                 workAllocationFromDate: employmentDto.workAllocationFromDate,
  //                 workAllocationToDate: employmentDto.workAllocationToDate,
  //                 noOfDaysWorkAlloted: employmentDto.noOfDaysWorkAlloted,
  //                 totalWagePaid: employmentDto.totalWagePaid,
  //                 empProvidedfrom: employmentDto.empProvidedfrom,
  //                 empProvidedto: employmentDto.empProvidedto,
  //                 dateOfPayment: employmentDto.dateOfPayment,
  //                 noOfDaysWorProvided: employmentDto.noOfDaysWorProvided,
  //                 currentMonth: employmentDto.currentMonth,
  //                 currentYear: employmentDto.currentYear,
  //                 finYear: employmentDto.finYear,
  //                 attandance: employmentDto.attandance,
  //                 userIndex: employmentDto.userIndex,
  //             });
  
  //             newWorkAllocations.push(newEmployment);
  //         }
  
  //         // Save all Employment records
  //         const result = await this.employment.save(newWorkAllocations);
  
  //         // Backtrack calculations
  //         const demanduniqueIDs = createDto.CreateEmploymentDtos.map(dto => dto.demandid);
  //         const schemeIds = createDto.CreateEmploymentDtos.map(dto => dto.schemeId);
  //         const totalWagePaid = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.totalWagePaid, 0);
  //         const personDaysGeneratedProvided = createDto.CreateEmploymentDtos.reduce((sum, dto) => sum + dto.noOfDaysWorkAlloted, 0);
  //         const totalLabourProvided = createDto.CreateEmploymentDtos.length;
  
  //         const schemes = await this.masterSchemeRepository.findByIds(schemeIds);
  //         const updates = schemes.map(scheme => ({
  //             scheme_sl: scheme.scheme_sl,
  //             schemeId: scheme.schemeId,
  //             totalCostprovided: scheme.totalCostprovided + totalWagePaid,
  //             totalLabourprovided: scheme.totalLabourprovided + totalLabourProvided,
  //             personDaysGeneratedprovided: scheme.personDaysGeneratedprovided + personDaysGeneratedProvided,
  //         }));
  
  //         await Promise.all([
  //             this.workallocation.update(
  //                 { workAllocationID: In(workAllocationIDs) },
  //                 { empId: employmentID, empStatus: "1" }
  //             ),
  //             this.Demandallotmenthistroy.update(
  //                 { demanduniqueID: In(demanduniqueIDs) },
  //                 { empid: employmentID, empStatus: "1" }
  //             ),
  //             ...updates.map(update =>
  //                 this.masterSchemeRepository.update(
  //                     { schemeId: update.schemeId },
  //                     {
  //                         totalCostprovided: update.totalCostprovided,
  //                         totalLabourprovided: update.totalLabourprovided,
  //                         personDaysGeneratedprovided: update.personDaysGeneratedprovided,
  //                     }
  //                 )
  //             ),
  //             ...updates.map(update =>
  //                 this.MasterSchemeExpendutureRepository.update(
  //                     { schemeId: update.scheme_sl },
  //                     {
  //                         totalWageCost: update.totalCostprovided,
  //                         totalLabour: update.totalLabourprovided,
  //                         personDaysGenerated: update.personDaysGeneratedprovided,
  //                         totalUnskilledWorkers: update.totalLabourprovided,
  //                     }
  //                 )
  //             )
  //         ]);
  
  //         return {
  //             errorCode: 0,
  //             message: "Employment Created Successfully",
  //             employment: employmentID,
  //         };
  //     } catch (error) {
  //         return {
  //             errorCode: 1,
  //             message: "Something went wrong: " + error.message,
  //         };
  //     }
  // }
  

  

  
    }

