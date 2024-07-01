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
import { EmploymentModule } from './api/employment/employment.module';
import 'reflect-metadata';
import { ForbiddenException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {

 
  // Express middleware
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: fs.readFileSync(path.join(__dirname, '..', 'keys', 'key.pem')),
    //   cert: fs.readFileSync(path.join(__dirname, '..', 'keys', 'cert.pem')),
    // },
  });
  const logger = new Logger('CORS');

  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  expressApp.disable('x-powered-by');

  app.enableCors({
    origin: ['http://localhost:5173'],
    // origin:true,
    // CORS HTTP methods
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', "x-api-key","token"],
    credentials: true,
  });

  app.use('/api/public', express.static(join(__dirname, '..', 'public')));

  app.use('/api/uploads', express.static(join(__dirname, '..', 'uploads')));
  const config = new DocumentBuilder()
    .setTitle('Karmashree')
    .setDescription('Karmashree API description')
    .setVersion('1.0')
    .build();
  
    
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule,MastertableModule,UserModule,ActionplanModule,ContractorModule,SchememasterModule,WorkerrequisitionModule,DemandModule,AllocationModule,EmploymentModule],
  });
  
  SwaggerModule.setup('api', app, document);
  
  await app.listen(8094);
}


bootstrap();
