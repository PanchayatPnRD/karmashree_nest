import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employment } from 'src/entity/employment.entity';
import { In, Repository } from 'typeorm';
import { CreateEmploymentDto, EmploymentDto } from './dto/employment.dto';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { MasterScheme } from 'src/entity/scheme.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';

@Injectable()
export class EmploymentService {
    constructor(
        @InjectRepository(Employment)private  employment: Repository<Employment>,
        @InjectRepository(WorkAllocation) private workallocation: Repository<WorkAllocation>,
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        @InjectRepository(MasterScheme)
        private  masterSchemeRepository: Repository<MasterScheme>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(mastersector) private mastersector: Repository<mastersector>,
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        
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
                attandance:CreateEmploymentDto.attandance,
              
                userIndex: CreateEmploymentDto.userIndex,
            });
        });
    
        const result = await this.employment.save(newWorkAllocations);
        const employment =  employmentID;

        const workAllocationIDs = createDto.CreateEmploymentDtos.map(dto => dto.workAllocationID);
    
        // Update WorkAllocation records with the new employmentID
        await this.workallocation.update({ workAllocationID: In(workAllocationIDs) }, { empId: employmentID,empStatus: "1"  });
    
        return {
            errorCode: 0,
            message:"Employment Created Successfully",
            employment,
            //result: result,
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
    }

