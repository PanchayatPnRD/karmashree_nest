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
            demanduniqueID: demanduniqueID
          });
  
          const createdMasterWorkerAllotment = await this.MasterWorkerDemandallotment.save(newMasterAllotment);
          masterAllotment.push(createdMasterWorkerAllotment);
        }
  
        return {
          errorCode: 0,
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

}
