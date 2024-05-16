import { Controller } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

@Controller('employment')
@ApiHeader({
    name: 'token',
  })
export class EmploymentController {}
