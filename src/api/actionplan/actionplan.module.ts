import { Module } from '@nestjs/common';
import { ActionplanService } from './actionplan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionplanController } from './actionplan.controller';
import { Actionplan_master, } from 'src/entity/actionplan.entity';

@Module({ imports: [

  TypeOrmModule.forFeature([Actionplan_master]),

],

  controllers: [ActionplanController],
  providers: [ActionplanService]
})         
export class ActionplanModule {}
