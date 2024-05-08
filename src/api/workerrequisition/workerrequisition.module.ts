import { Module } from '@nestjs/common';
import { WorkerrequisitionService } from './workerrequisition.service';
import { WorkerrequisitionController } from './workerrequisition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([MasterWorkerRequirement,MasterWorkerRequirement_allotment]),
   
  ],


  controllers: [WorkerrequisitionController],

  providers: [WorkerrequisitionService]
})
export class WorkerrequisitionModule {}
