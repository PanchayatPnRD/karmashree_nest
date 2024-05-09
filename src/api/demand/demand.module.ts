import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandMaster, MasterWorkerDemand_allotment } from 'src/entity/demandmaster.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([DemandMaster,MasterWorkerDemand_allotment]),
   
  ],
  
  controllers: [DemandController],
  providers:[DemandService]
})
export class DemandModule {}
