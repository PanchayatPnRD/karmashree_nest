import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employment } from 'src/entity/employment.entity';
import { Repository } from 'typeorm';
import { CreateEmploymentDto, EmploymentDto } from './dto/employment.dto';

@Injectable()
export class EmploymentService {
    constructor(
        @InjectRepository(Employment)private  employment: Repository<Employment>,


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
}
