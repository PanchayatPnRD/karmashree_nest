import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
        @Query('districtcode') districtcode?: number,
        @Query('blockcode') blockcode?: number,
        @Query('gpCode') gpCode?: number,
        @Query('municipalityCode') municipalityCode?: number,
        @Query('schemeId') schemeId?: number,
      ){
        return await this.employmentService.listWorkAllocations(districtcode,blockcode, gpCode,municipalityCode, schemeId,);
      }

      @Get('getemploymentList/:userIndex')
      async getemploymentList(@Param('userIndex') userIndex: number) {
      
              const employments = await this.employmentService.getemploymentList(userIndex);
              return  employments 
         
      }

      @Post('creatediretemp')
      async   creatediretemp(@Body() createDto: EmploymentDto) {
          return this.employmentService.creatediretemp(createDto);
        }

        @Get('employment_wisereport')
  async getEmploymentSummary() {
    return await this.employmentService.getEmploymentSummary();
  }

  @Get('Executing_Department_wise_report-')
  async Executing_Department() {
    return await this.employmentService.getExecuting_Department();
  }

  
    

}
