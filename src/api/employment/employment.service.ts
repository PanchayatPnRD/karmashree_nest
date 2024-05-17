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
            message:"Employment Created Successfully",
            result: result
        };
    }

    async listWorkAllocations(blockcode: number, gpCode?: number,municipalityCode?: number, schemeId?: number){
        try {
          const queryBuilder = this.workallocation.createQueryBuilder('workAllocation');
    
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

                    
    
                    employmentsWithDetails.push({
                        ...employment,
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
                result: employmentsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch employments from the database:', error);
            throw new Error('Failed to fetch employments from the database.');
        }
    }
    
    }

