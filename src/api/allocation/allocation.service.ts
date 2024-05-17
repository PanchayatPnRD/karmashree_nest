import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { DemandMaster, MasterWorkerDemand_allotment } from 'src/entity/demandmaster.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { In, Repository } from 'typeorm';
import { CreateWorkAllocationDto, WorkAllocationDto } from './dto/allocation.dto';

@Injectable()
export class AllocationService {
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
    @InjectRepository(WorkAllocation) private workallocation: Repository<WorkAllocation>,
    @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
    @InjectRepository(MasterWorkerDemand_allotment) private MasterWorkerDemandallotment: Repository<MasterWorkerDemand_allotment>,
    @InjectRepository(MasterWorkerRequirement) private masterWorkerRequirement: Repository<MasterWorkerRequirement>,
    @InjectRepository(MasterWorkerRequirement_allotment) private masterWorkerRequirementallotment: Repository<MasterWorkerRequirement_allotment>,


) {}

async create(createWorkAllocationDto: CreateWorkAllocationDto) {
  const newWorkAllocations = createWorkAllocationDto.workAllocations.map(workAllocationDto => {
    return this.workallocation.create({
      schemeArea: workAllocationDto.schemeArea,
      departmentNo: workAllocationDto.departmentNo,
      districtcode: workAllocationDto.districtcode,
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
  
  // Assuming workallocationsl is some unique identifier associated with the new work allocations
  const workallocationsl = newWorkAllocations.map(allocation => allocation.workallocationsl);

  const workerJobCardNos = createWorkAllocationDto.workAllocations.map(dto => dto.workerJobCardNo);
  const workerDemandAllotments = await this.MasterWorkerDemandallotment.find({
    where: { workerJobCardNo: In(workerJobCardNos) },
  });
  
  for (let i = 0; i < newWorkAllocations.length; i++) {
    const workAllocationDto = createWorkAllocationDto.workAllocations[i];
    const matchingAllotment = workerDemandAllotments.find(allotment => allotment.workerJobCardNo === workAllocationDto.workerJobCardNo);
    if (matchingAllotment) {
      matchingAllotment.allotmentuserIndex = workAllocationDto.userIndex;
      matchingAllotment.allocationID = workallocationsl[i];
      await this.MasterWorkerDemandallotment.save(matchingAllotment); // Save the updated allotment
    }
  }

  return {errorCode: 0, message:"Allocation Created Successfully"};
}


async getallocationList(userIndex: number) {
  try {
      const allocations = await this.workallocation.find({ where: { userIndex },  order: { workallocationsl: 'DESC' }  });

      if (!allocations || allocations.length === 0) {
          return {
              errorCode: 1,
              message: 'allocations not found for the provided user index',
          };
      }

      const allocationsWithDetails = [];

      await Promise.all(allocations.map(async (allocation) => {
          try {
              // const districtDetails = await this.getAllDistricts(contractor.districtcode);
              // const districtName = districtDetails.result ? districtDetails.result.districtName : '';

              // const blockDetails = await this.getAllblock(contractor.blockcode);
              // const blockname = blockDetails.result ? blockDetails.result.blockName : '';

              // const gpDetails = await this.getAllgp(contractor.gpCode);
              // const gpName = gpDetails.result ? gpDetails.result.gpName : '';

              // const deptDetails = await this.getDepatmentbyid(contractor.DepartmentNo);
              // const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

              // const muniDetails = await this.getmunibyid(contractor.Municipality);
              // const muniName = muniDetails.result ? muniDetails.result.urbanCode : '';

              

              allocationsWithDetails.push({
                  ...allocation,
                  // districtName: districtName,
                  // blockname: blockname,
                  // gpName: gpName,
                  // deptName: deptName,
                  // muniName: muniName,
              });
          } catch (error) {
              // Log the error for this contractor
              console.error(`Failed to fetch details for contractor`);
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
}
