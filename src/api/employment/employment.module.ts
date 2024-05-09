import { Module } from '@nestjs/common';
import { EmploymentController } from './employment.controller';

@Module({
  controllers: [EmploymentController]
})
export class EmploymentModule {}
