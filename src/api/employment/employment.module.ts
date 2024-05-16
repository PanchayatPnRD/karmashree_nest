import { Module } from '@nestjs/common';
import { EmploymentController } from './employment.controller';
import { EmploymentService } from './employment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { Employment } from 'src/entity/employment.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master,Employment]),
   
  ],
  controllers: [EmploymentController],
  providers: [EmploymentService],
})
export class EmploymentModule {}
