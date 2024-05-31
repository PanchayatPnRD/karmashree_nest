import { Module } from '@nestjs/common';
import { EmploymentController } from './employment.controller';
import { EmploymentService } from './employment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { Employment } from 'src/entity/employment.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterScheme } from 'src/entity/scheme.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector } from 'src/entity/mastertable.enity';
import { MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,Employment,WorkAllocation,MasterScheme,master_zp,masterdepartment,
      master_subdivision,master_ps,gram_panchayat,masterdepartment,MasterWorkerDemand_allotmenthistroy,
      master_urban,mastersector]),
   
  ],
  controllers: [EmploymentController],
  providers: [EmploymentService],
})
export class EmploymentModule {}
