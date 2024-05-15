import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { DemandMaster, MasterWorkerDemand_allotment } from 'src/entity/demandmaster.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { Repository } from 'typeorm';
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

async create(createWorkAllocationDto: CreateWorkAllocationDto): Promise<{ errorCode: number, result: WorkAllocation[] }> {
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

    for (const workAllocationDto of createWorkAllocationDto.workAllocations) {
        const workerDemandAllotment = await this.MasterWorkerDemandallotment.findOne({
          where: { workerJobCardNo: workAllocationDto.workerJobCardNo },
        });
  
        if (workerDemandAllotment) {
          workerDemandAllotment.allotmentuserIndex = workAllocationDto.userIndex;
  
          await this.MasterWorkerDemandallotment.save(workerDemandAllotment);
        }
      }
    return {
      errorCode: 0,
      result: result
    };
  }


}
