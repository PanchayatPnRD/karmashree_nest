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
const cluster = require('cluster');
import { cpus } from 'os';
import * as basicAuth from 'express-basic-auth';
import { BlockExternalMiddleware } from './commomn/cors.middleware';

if (cluster.isPrimary ) {
  //console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  cpus().forEach(() => cluster.fork());

  cluster.on('exit', (worker, code, signal) => {
   // console.log(`worker ${worker.process.pid} died`);
  });
} else {
  async function bootstrap() {

 
    // Express middleware
    const app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync(path.join(__dirname, '..', 'keys', 'be2b1_8586b_8267f6ff192937e0e1d25c0e5dd1d73e.key')),
        cert: fs.readFileSync(path.join(__dirname, '..', 'keys', 'karmashree_wbdeptemployment_in_be2b1_8586b_1744183421_1d67cd228cef226a79e54935df24f69b.crt')),
       // ca: fs.readFileSync(path.join(__dirname, '..', 'keys', 'SectigoRSADomainValidationSecureServerCA.crt')),
      },
    });
    const logger = new Logger('CORS');
  
    const expressApp = app.getHttpAdapter().getInstance();
  
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use(express.json());
    expressApp.disable('x-powered-by');
   app.use(new BlockExternalMiddleware().use);
    app.enableCors({
      origin: ['http://karmashree.wbdeptemployment.in','http://wbkarmashree.in'],
      // origin:true,
      // CORS HTTP methods
      methods: ['GET', 'POST', 'PUT'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'token'],
      exposedHeaders: ['Authorization'],
      credentials: true,
    });
  
   
    app.use(
      '/api/public',
      express.static(join(__dirname, '..', 'public'), {
        setHeaders: (res, path) => {
          if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
          }
        },
      }),
    );

  
   // app.use('/api/public', express.static(join(__dirname, '..', 'public')));
  
    app.use('/api/uploads', express.static(join(__dirname, '..', 'uploads')));
    const config = new DocumentBuilder()
      .setTitle('Karmashree')
      .setDescription('Karmashree API description')
     // .addApiKey({type: 'apiKey', name: 'Authorisation', in: 'header'})
      .setVersion('1.0')
      .build();
    
      
    const document = SwaggerModule.createDocument(app, config, {
      include: [AuthModule,MastertableModule,UserModule,ActionplanModule,ContractorModule,SchememasterModule,WorkerrequisitionModule,DemandModule,AllocationModule,EmploymentModule],
    });
    
    SwaggerModule.setup('api-doc', app, document);
    
    await app.listen(8094);
  }
  bootstrap();
}
