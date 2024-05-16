import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employment } from 'src/entity/employment.entity';
import { Repository } from 'typeorm';
import { CreateEmploymentDto, EmploymentDto } from './dto/employment.dto';
import { WorkAllocation } from 'src/entity/workallocation.entity';

@Injectable()
export class EmploymentService {
    constructor(
        @InjectRepository(Employment)private  employment: Repository<Employment>,
        @InjectRepository(WorkAllocation) private workallocation: Repository<WorkAllocation>,

    ) {}

    async create(createDto: EmploymentDto) {
        const newWorkAllocations = createDto.CreateEmploymentDtos.map(CreateEmploymentDto => {
            return this.employment.create({
                schemeArea: CreateEmploymentDto.schemeArea,
                departmentNo: CreateEmploymentDto.departmentNo,
                districtcode: CreateEmploymentDto.districtcode,
                municipalityCode: CreateEmploymentDto.municipalityCode,
                blockcode: CreateEmploymentDto.blockcode,
                gpCode: CreateEmploymentDto.gpCode,
                schemeId: CreateEmploymentDto.schemeId,
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
                dateOfPayment: CreateEmploymentDto.dateOfPayment,
                currentMonth: CreateEmploymentDto.currentMonth,
                currentYear: CreateEmploymentDto.currentYear,
                finYear: CreateEmploymentDto.finYear,
              
                userIndex: CreateEmploymentDto.userIndex,
            });
        });
    
        const result = await this.employment.save(newWorkAllocations);
    
        return {
            errorCode: 0,
            result: result
        };
    }

    async listWorkAllocations(blockcode: number, gpCode?: number, schemeId?: number){
        try {
          const queryBuilder = this.workallocation.createQueryBuilder('workAllocation');
    
          if (blockcode) {
            queryBuilder.andWhere('workAllocation.blockcode = :blockcode', { blockcode });
          }
    
          if (gpCode) {
            queryBuilder.andWhere('workAllocation.gpCode = :gpCode', { gpCode });
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
    }

