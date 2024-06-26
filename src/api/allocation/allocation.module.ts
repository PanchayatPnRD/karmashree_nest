import { Module } from '@nestjs/common';
import { AllocationController } from './allocation.controller';
import { AllocationService } from './allocation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { DemandMaster, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { master_users } from 'src/entity/user.entity';

@Module({  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,master_zp,masterdepartment,
        master_subdivision,master_ps,gram_panchayat,masterdepartment,
        MasterScheme,MasterSchemeExpenduture,master_urban,
        WorkAllocation,DemandMaster,
        MasterWorkerDemand_allotment,MasterWorkerRequirement,
        MasterWorkerRequirement_allotment,MasterWorkerDemand_allotmenthistroy,master_users]),
   
  ],


 
  controllers: [AllocationController],
   
  providers: [AllocationService]
})
export class AllocationModule {}

