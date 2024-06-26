import { Module } from '@nestjs/common';
import { ActionplanService } from './actionplan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionplanController } from './actionplan.controller';
import { Actionplan_master, } from 'src/entity/actionplan.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';

@Module({ imports: [

  TypeOrmModule.forFeature([Actionplan_master,master_zp,masterdepartment,master_subdivision,master_ps,gram_panchayat,masterdepartment,mastersector,master_urban,pedestalMaster]),

],

  controllers: [ActionplanController],
  providers: [ActionplanService]
})         
export class ActionplanModule {}
