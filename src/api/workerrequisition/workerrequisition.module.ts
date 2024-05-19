import { Module } from '@nestjs/common';
import { WorkerrequisitionService } from './workerrequisition.service';
import { WorkerrequisitionController } from './workerrequisition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector } from 'src/entity/mastertable.enity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([MasterWorkerRequirement,MasterWorkerRequirement_allotment,master_zp,masterdepartment,
      master_subdivision,master_ps,gram_panchayat,masterdepartment,
      master_urban,mastersector]),
   
  ],


  controllers: [WorkerrequisitionController],

  providers: [WorkerrequisitionService]
})
export class WorkerrequisitionModule {}
