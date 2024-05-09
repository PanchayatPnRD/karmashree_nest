import { Module } from '@nestjs/common';
import { MastertableService } from './mastertable.service';
import { MastertableController } from './mastertable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, masterdesignation, mastersector, pedestalMaster, user_role } from 'src/entity/mastertable.enity';
import { jobcardformat } from 'src/entity/nrgsjobcardformat.entity';

@Module({  imports: [


    TypeOrmModule.forFeature([user_role,master_zp,master_subdivision,master_ps,mastersector,masterdepartment,gram_panchayat,masterdesignation,master_urban,pedestalMaster,jobcardformat]),
   
  ],



  controllers: [MastertableController],
  providers: [MastertableService]
})
export class MastertableModule {}
