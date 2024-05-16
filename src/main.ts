import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import { MastertableModule } from './api/mastertable/mastertable.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ActionplanModule } from './api/actionplan/actionplan.module';
import { ContractorModule } from './api/contractor/contractor.module';
import { SchememasterModule } from './api/schememaster/schememaster.module';
import { WorkerrequisitionModule } from './api/workerrequisition/workerrequisition.module';
import { DemandModule } from './api/demand/demand.module';
import { AllocationModule } from './api/allocation/allocation.module';
import * as fs from 'fs';
import * as path from 'path';



async function bootstrap() {
  // const basePath = process.cwd(); // This points to the root directory of your project
  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(basePath, 'keys', 'key.pem')),
  //   cert: fs.readFileSync(path.join(basePath, 'keys', 'cert.pem')),
  // };
  
  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });



  app.enableCors();

  app.use('/api/public', express.static(join(__dirname, '..', 'public')));


  const config = new DocumentBuilder()
    .setTitle('Karmashree')
    .setDescription('Karmashree API description')
    .setVersion('1.0')
    .build();
  
    
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule,MastertableModule,UserModule,ActionplanModule,ContractorModule,SchememasterModule,WorkerrequisitionModule,DemandModule,AllocationModule],
  });
  
  SwaggerModule.setup('api', app, document);
  
  await app.listen(8094);
}


bootstrap();
