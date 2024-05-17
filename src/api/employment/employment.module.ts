import { Module } from '@nestjs/common';
import { EmploymentController } from './employment.controller';
import { EmploymentService } from './employment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { Employment } from 'src/entity/employment.entity';
import { WorkAllocation } from 'src/entity/workallocation.entity';
import { MasterScheme } from 'src/entity/scheme.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,Employment,WorkAllocation,MasterScheme]),
   
  ],
  controllers: [EmploymentController],
  providers: [EmploymentService],
})
export class EmploymentModule {}
