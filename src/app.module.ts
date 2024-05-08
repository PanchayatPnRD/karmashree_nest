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

import { WorkerrequisitionModule } from './api/workerrequisition/workerrequisition.module';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from './entity/workrequigition.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      // username: 'wbdeptemployment_karmashreeadmin',
      // password: '89lD{wBg{s!q',
      // database: 'wbdeptemployment_karmashree',
      username: 'root',
      password: '',
      database: 'karmashree',
      //  host: 'bhowbums72vrebslxsrz-mysql.services.clever-cloud.com',
      // database: 'bhowbums72vrebslxsrz',
      // username: 'usgtbztvqrdg0vjq',
      // password: '6qKfYZrQshnAuWwCAj7a',
      // host: '103.165.118.211',
      // //port: 3306, // Default MySQL port
      // username: 'wbdeptemployment_karmashreeadmin',
      // password: 'xQW+g~(zC!HA$8',

      // database: 'wbdeptemployment_karmashreeTestdb',
      entities: [user_role,master_zp,master_urban,master_ps,master_subdivision,mastersector,masterdepartment,gram_panchayat,master_users,masterdesignation,Actionplan_master,Contractor_master,MasterScheme,MasterSchemeExpenduture,pedestalMaster,MasterWorkerRequirement,MasterWorkerRequirement_allotment],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    AuthModule,MastertableModule,UserModule,ActionplanModule,ContractorModule,SchememasterModule, WorkerrequisitionModule

  ],

  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {

    // consumer.apply(ApiTokenCheckMiddleware).forRoutes(
      // 'api/agency' ,


          // )
        }
      }

