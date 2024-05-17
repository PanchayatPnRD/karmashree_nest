import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemandMaster, MasterWorkerDemand_allotment } from 'src/entity/demandmaster.entity';
import { Repository } from 'typeorm';
import { CreateDemandMasterDto } from './dto/demand.entity';

@Injectable()
export class DemandService {
    constructor(
        @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
        @InjectRepository(MasterWorkerDemand_allotment) private MasterWorkerDemandallotment: Repository<MasterWorkerDemand_allotment>,

        
    ) {}

    private generateRandomNumber(): string {
      const range = { min: 1111, max: 9999 };
      const delta = range.max - range.min;
      const rand = Math.round(range.min + Math.random() * delta);
      return rand.toString();
    }
  
    async createDemand(createDto: CreateDemandMasterDto){
      try {
        const created: DemandMaster[] = [];
        const masterAllotment: MasterWorkerDemand_allotment[] = [];
  
        for (const actionDto of createDto.DemandMasterDto) {
          const demanduniqueID = this.generateRandomNumber();
  
          const createdTreatment = this.demandMaster.create({
            ...actionDto,
            demanduniqueID
          });
          await this.demandMaster.save(createdTreatment);
          created.push(createdTreatment);
  
          const newMasterAllotment = this.MasterWorkerDemandallotment.create({
            demanduniqueID,
            schemeArea: actionDto.schemeArea,
            departmentNo: actionDto.departmentNo,
            districtcode: actionDto.districtcode,
            municipalityCode: actionDto.municipalityCode,
            blockcode: actionDto.blockcode,
            gpCode: actionDto.gpCode,
            workerJobCardNo: actionDto.workerJobCardNo,
            dateofwork: actionDto.dateOfApplicationForWork,
            CurrentMonth_work: actionDto.currentMonth,
            CurrentYear_work: actionDto.currentYear,
           
          });
  
          const createdMasterWorkerAllotment = await this.MasterWorkerDemandallotment.save(newMasterAllotment);
          masterAllotment.push(createdMasterWorkerAllotment);
        }
  
        return {
          errorCode: 0,
          message:"Demand Created Successfully",
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

                    
    
                    demandsWithDetails.push({
                        ...demand,
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
                result: demandsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch demands from the database:', error);
            throw new Error('Failed to fetch demands from the database.');
        }
    }
    
    

}
