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

            for (const actionDto of createDto.DemandMasterDto) {
                const createdTreatment = await this.demandMaster.create(actionDto);
                await this.demandMaster.save(createdTreatment);
                created.push(createdTreatment);
            }

            return {
                errorCode: 0,
                result: created,
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong: " + error.message,
            };
        }
    }
  

}
