import { Module } from '@nestjs/common';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master, Contractor_master_draft } from 'src/entity/contractor.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,master_zp,
      masterdepartment,master_subdivision,
      master_ps,gram_panchayat,
      masterdepartment,master_urban,
      MasterWorkerRequirement,
      Contractor_master_draft,
      MasterWorkerRequirement_allotment]),
   
  ],


  controllers: [ContractorController],
  providers: [ContractorService]
})
export class ContractorModule {}

