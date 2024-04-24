import { Module } from '@nestjs/common';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';

@Module({
  imports: [

  
  
    TypeOrmModule.forFeature([Contractor_master]),
   
  ],


  controllers: [ContractorController],
  providers: [ContractorService]
})
export class ContractorModule {}
