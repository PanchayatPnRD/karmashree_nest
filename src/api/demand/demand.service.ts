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

    async createDemand(createDto: CreateDemandMasterDto) {
        try {
          const created: DemandMaster[] = [];
          const masterAllotment: MasterWorkerDemand_allotment[] = []; // Define masterAllotment array
      
          for (const actionDto of createDto.DemandMasterDto) {
            const createdTreatment = await this.demandMaster.create(actionDto);
            await this.demandMaster.save(createdTreatment);
            created.push(createdTreatment);
      
            // Create new MasterWorkerDemandallotment entity
            const newMasterAllotment = this.MasterWorkerDemandallotment.create({
              schemeArea: actionDto.schemeArea, // Assuming schemeArea is a property of actionDto
              departmentNo:actionDto.departmentNo,
districtcode:actionDto.districtcode,
municipalityCode:actionDto.municipalityCode,
blockcode:actionDto.blockcode,
gpCode:actionDto.gpCode,

workerJobCardNo:actionDto.workerJobCardNo,
dateofwork:actionDto.dateOfApplicationForWork,


CurrentMonth_work:actionDto.currentMonth,

CurrentYear_work:actionDto.currentYear,

//finYear:actionDto.finYear
             
            });
      
            // Save the MasterWorkerDemandallotment entity
            const createdMasterWorkerAllotment = await this.MasterWorkerDemandallotment.save(newMasterAllotment);
      
            // Push the saved entity to the masterAllotment array
            masterAllotment.push(createdMasterWorkerAllotment);
          }
      
          return {
            errorCode: 0,
            result: created,
           // masterAllotment: masterAllotment // Return masterAllotment for reference if needed
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

}
