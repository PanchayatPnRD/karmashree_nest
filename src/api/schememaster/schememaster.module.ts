import { Module } from '@nestjs/common';
import { SchememasterController } from './schememaster.controller';
import { SchememasterService } from './schememaster.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { Contractor_master } from 'src/entity/contractor.entity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,master_zp,masterdepartment,master_subdivision,master_ps,gram_panchayat,masterdepartment,MasterScheme,MasterSchemeExpenduture,master_urban]),
   
  ],


 
  controllers: [SchememasterController],
   
  providers: [SchememasterService]
})
export class SchememasterModule {}