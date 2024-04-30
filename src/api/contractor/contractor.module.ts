import { Module } from '@nestjs/common';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { gram_panchayat, master_ps, master_subdivision, master_zp, masterdepartment } from 'src/entity/mastertable.enity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,master_zp,masterdepartment,master_subdivision,master_ps,gram_panchayat,masterdepartment,]),
   
  ],


  controllers: [ContractorController],
  providers: [ContractorService]
})
export class ContractorModule {}

