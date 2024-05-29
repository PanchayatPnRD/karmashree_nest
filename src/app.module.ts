import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, masterdesignation, mastersector, pedestalMaster, user_role } from './entity/mastertable.enity';
import { master_users } from './entity/user.entity';
import { MastertableModule } from './api/mastertable/mastertable.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { Actionplan_master,  } from './entity/actionplan.entity';
import { ActionplanModule } from './api/actionplan/actionplan.module';
import { Contractor_master } from './entity/contractor.entity';
import { ContractorModule } from './api/contractor/contractor.module';
import { MasterScheme, MasterSchemeExpenduture } from './entity/scheme.entity';
import { SchememasterModule } from './api/schememaster/schememaster.module';
import * as dotenv from 'dotenv';

import { WorkerrequisitionModule } from './api/workerrequisition/workerrequisition.module';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from './entity/workrequigition.entity';
import { jobcardformat } from './entity/nrgsjobcardformat.entity';
import { DemandModule } from './api/demand/demand.module';
import { DemandMaster, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from './entity/demandmaster.entity';
import { WorkAllocation } from './entity/workallocation.entity';
import { AllocationModule } from './api/allocation/allocation.module';
import { ApiTokenCheckMiddleware } from './commomn/middleware/apiTokenCheck.middleware';
import { Employment } from './entity/employment.entity';
import { EmploymentModule } from './api/employment/employment.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
          // username: 'wbdeptemployment_karmashreeadmin',
      // password: '89lD{wBg{s!q',
      // database: 'wbdeptemployment_karmashree',
      //  host: 'bhowbums72vrebslxsrz-mysql.services.clever-cloud.com',
      // database: 'bhowbums72vrebslxsrz',
      // username: 'usgtbztvqrdg0vjq',
      // password: '6qKfYZrQshnAuWwCAj7a',
      // host: '103.165.118.211',
      // //port: 3306, // Default MySQL port
      // username: 'wbdeptemployment_karmashreeadmin',
      // password: 'xQW+g~(zC!HA$8',

      // database: 'wbdeptemployment_karmashreeTestdb',
      entities: [user_role,master_zp,master_urban,master_ps,master_subdivision,mastersector,masterdepartment,gram_panchayat,master_users,
        masterdesignation,Actionplan_master,Contractor_master,MasterScheme,
        MasterSchemeExpenduture,pedestalMaster,MasterWorkerRequirement,MasterWorkerRequirement_allotment,
        jobcardformat,DemandMaster,MasterWorkerDemand_allotment,WorkAllocation,Employment,MasterWorkerDemand_allotmenthistroy],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    AuthModule,MastertableModule,UserModule,ActionplanModule,ContractorModule,SchememasterModule, WorkerrequisitionModule,DemandModule,AllocationModule,EmploymentModule

  ],

  
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {

    consumer.apply(ApiTokenCheckMiddleware).forRoutes(
      // 'api/Actionplan' ,'api/allocation','api/contractor','api/demand',
      // 'api/mastertable','api/schememaster','api/user','api/workerrequisition'


          )
        }
      }

