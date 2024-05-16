import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { EmploymentDto } from './dto/employment.dto';
import { EmploymentService } from './employment.service';
import { WorkAllocation } from 'src/entity/workallocation.entity';

@ApiTags("employment")
@ApiHeader({
  name: 'token',
})
@Controller('api/employment')

export class EmploymentController {
  constructor(private readonly employmentService: EmploymentService) {}
  @Post('allocation')
    async create(@Body() createDto: EmploymentDto) {
        return this.employmentService.create(createDto);
      }

      @Get('listofallocationinemplyment')
      async listWorkAllocations(
        @Query('blockcode') blockcode: number,
        @Query('gpCode') gpCode?: number,
        @Query('schemeId') schemeId?: number,
      ){
        return await this.employmentService.listWorkAllocations(blockcode, gpCode, schemeId);
      }

}
