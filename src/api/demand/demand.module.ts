import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandMaster, DemandMaster_draft, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([DemandMaster,MasterWorkerDemand_allotment,master_zp,masterdepartment,
      master_subdivision,master_ps,gram_panchayat,masterdepartment,MasterWorkerDemand_allotmenthistroy,
      master_urban,DemandMaster_draft]),
   
  ],
  
  controllers: [DemandController],
  providers:[DemandService]
})
export class DemandModule {}
