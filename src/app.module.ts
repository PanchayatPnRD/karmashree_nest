import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  gram_panchayat,
  master_ps,
  master_subdivision,
  master_urban,
  master_zp,
  masterdepartment,
  masterdesignation,
  mastersector,
  pedestalMaster,
  user_role,
} from './entity/mastertable.enity';
import { master_users } from './entity/user.entity';
import { MastertableModule } from './api/mastertable/mastertable.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { Actionplan_master } from './entity/actionplan.entity';
import { ActionplanModule } from './api/actionplan/actionplan.module';
import { Contractor_master, Contractor_master_draft } from './entity/contractor.entity';
import { ContractorModule } from './api/contractor/contractor.module';
import { MasterScheme, masterscheme_2024_2025, MasterScheme_draft, MasterSchemeExpenduture } from './entity/scheme.entity';
import { SchememasterModule } from './api/schememaster/schememaster.module';
import * as dotenv from 'dotenv';

import { WorkerrequisitionModule } from './api/workerrequisition/workerrequisition.module';
import {
  MasterWorkerRequirement,
  MasterWorkerRequirement_allotment,
} from './entity/workrequigition.entity';
import { jobcardformat } from './entity/nrgsjobcardformat.entity';
import { DemandModule } from './api/demand/demand.module';
import {
  DemandMaster,
  DemandMaster_draft,
  
  MasterWorkerDemand_allotment,
  MasterWorkerDemand_allotmenthistroy,
} from './entity/demandmaster.entity';
import { WorkAllocation } from './entity/workallocation.entity';
import { AllocationModule } from './api/allocation/allocation.module';
import { ApiTokenCheckMiddleware } from './commomn/middleware/apiTokenCheck.middleware';
import { Employment } from './entity/employment.entity';
import { EmploymentModule } from './api/employment/employment.module';
import { Libariry } from './entity/library.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RateLimitMiddleware } from './commomn/rate-limit.middleware';
dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      entities: [
        user_role,
        master_zp,
        master_urban,
        master_ps,
        master_subdivision,
        mastersector,
        masterdepartment,
        gram_panchayat,
        master_users,
        masterdesignation,
        Actionplan_master,
        Contractor_master,
        MasterScheme,
        MasterSchemeExpenduture,
        pedestalMaster,
        MasterWorkerRequirement,
        MasterWorkerRequirement_allotment,
        jobcardformat,
        DemandMaster,
        MasterWorkerDemand_allotment,
        WorkAllocation,
        Employment,
        MasterWorkerDemand_allotmenthistroy,
        masterscheme_2024_2025,
        Libariry,
        Contractor_master_draft,
        MasterScheme_draft,
        DemandMaster_draft
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    MastertableModule,
    UserModule,
    ActionplanModule,
    ContractorModule,
    SchememasterModule,
    WorkerrequisitionModule,
    DemandModule,
    AllocationModule,
    EmploymentModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RateLimitMiddleware)
    .forRoutes('api/auth/resend-otp'); // Apply RateLimitMiddleware to 'auth/resend-otp' route

    consumer
      .apply(ApiTokenCheckMiddleware)
      .exclude(
        'api/schememaster/home_dashboard'
      )
      .forRoutes(
        'api/Actionplan',
        'api/allocation',
        'api/contractor',
        'api/demand',
        'api/mastertable',
        'api/schememaster',
        'api/workerrequisition',
        'api/employment',
        'api/user'
      );
  }
}
