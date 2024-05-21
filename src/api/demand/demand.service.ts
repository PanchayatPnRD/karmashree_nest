import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemandMaster, MasterWorkerDemand_allotment } from 'src/entity/demandmaster.entity';
import { Repository } from 'typeorm';
import { CreateDemandMasterDto } from './dto/demand.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';

@Injectable()
export class DemandService {
    constructor(
        @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
        @InjectRepository(MasterWorkerDemand_allotment) private MasterWorkerDemandallotment: Repository<MasterWorkerDemand_allotment>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
       
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        
        
    ) {}

    private generateEMPID(): string {
      const random6Digits = Math.floor(100000 + Math.random() * 900000).toString();
      return `DEMD${random6Digits}`;
    }
  async createDemand(createDto: CreateDemandMasterDto) {
  try {
    const created: DemandMaster[] = [];
    const masterAllotment: MasterWorkerDemand_allotment[] = [];

    for (const actionDto of createDto.DemandMasterDto) {
      const demanduniqueID = this.generateEMPID();

      const createdTreatment = this.demandMaster.create({
        ...actionDto,
        demanduniqueID
      });
      await this.demandMaster.save(createdTreatment);
      created.push(createdTreatment);

      const startDate = new Date(actionDto.dateOfApplicationForWork);
      
      for (let i = 0; i < actionDto.noOfDaysWorkDemanded; i++) {
        const currentWorkDate = new Date(startDate);
        currentWorkDate.setDate(startDate.getDate() + i);

        const newMasterAllotment = this.MasterWorkerDemandallotment.create({
          demanduniqueID,
          schemeArea: actionDto.schemeArea,
          departmentNo: actionDto.departmentNo,
          districtcode: actionDto.districtcode,
          municipalityCode: actionDto.municipalityCode,
          blockcode: actionDto.blockcode,
          gpCode: actionDto.gpCode,
          workerJobCardNo: actionDto.workerJobCardNo,
          dateofwork: currentWorkDate,
          CurrentMonth_work: actionDto.currentMonth,
          CurrentYear_work: actionDto.currentYear,
        });

        const createdMasterWorkerAllotment = await this.MasterWorkerDemandallotment.save(newMasterAllotment);
        masterAllotment.push(createdMasterWorkerAllotment);
      }
    }

    return {
      errorCode: 0,
      message: "Demand Created Successfully",
      result: created
    };
  } catch (error) {
    return {
      errorCode: 1,
      message: "Something went wrong: " + error.message,
    };
  }
}

    


    async getdemandforallocation(blockcode: number, gpCode?: number) {
        try {
          let work;
    
          if (blockcode) {
            work = await this.demandMaster.find({ where: { blockcode, gpCode } });
          } else {
            work = await this.demandMaster.find({ where: { blockcode } });
          }
    
          return { errorCode: 0, result: work };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }

      async getdemandList(userIndex: number) {
        try {
            const demands = await this.demandMaster.find({ where: { userIndex },  order: { demandsl: 'DESC' }  });
    
            if (!demands || demands.length === 0) {
                return {
                    errorCode: 1,
                    message: 'demands not found for the provided user index',
                };
            }
    
            const demandsWithDetails = [];
    
            await Promise.all(demands.map(async (demand) => {
                try {
                    const districtDetails = await this.getAllDistricts(demand.districtcode);
                    const districtName = districtDetails.result ? districtDetails.result.districtName : '';
    
                    const blockDetails = await this.getAllblock(demand.blockcode);
                    const blockname = blockDetails.result ? blockDetails.result.blockName : '';
    
                    const gpDetails = await this.getAllgp(demand.gpCode);
                    const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
                    const deptDetails = await this.getDepatmentbyid(demand.departmentNo);
                    const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

                    const muniDetails = await this.getmunibyid(demand.municipalityCode);
                    const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

                    
    
                    demandsWithDetails.push({
                        ...demand,
                        districtName: districtName,
                        blockname: blockname,
                        gpName: gpName,
                        deptName: deptName,
                        muniName: muniName,
                    });
                } catch (error) {
                    // Log the error for this contractor
                    console.error(`Failed to fetch details for contractor`);
                }
            }));
    
            return {
                errorCode: 0,
                result: demandsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch demands from the database:', error);
            throw new Error('Failed to fetch demands from the database.');
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
    

}
