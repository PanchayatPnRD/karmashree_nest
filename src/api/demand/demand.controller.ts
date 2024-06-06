import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DemandService } from './demand.service';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateDemandMasterDto } from './dto/demand.entity';

@ApiTags("demand")
@ApiHeader({
  name: 'token',
})
@Controller('api/demand')
export class DemandController {
    constructor(private readonly demandService: DemandService) {}
    
    @Post('createDemand')
    async createDemand(@Body() createDto: CreateDemandMasterDto) {
        return await this.demandService.createDemand(createDto);
    }

    @Get('getDemandforAllocation')
    @ApiQuery({ name: 'gpCode', required: false, type: Number }) 
    async getdemandforallocation(@Query('blockcode') blockcode: number, @Query('gpCode') gpCode?: number) {
      try {
        const result = await this.demandService.getdemandforallocation(blockcode, gpCode);
        return result;
      } catch (error) {
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
    }

    @Get('getdemandList/:userIndex')
    async getdemandList(@Param('userIndex') userIndex: number) {
    
            const demands = await this.demandService.getdemandList(userIndex);
            return  demands 
       
    }

    @Get('getDemandsforallocation_and_direct_emp')
   // @ApiQuery({ name: 'gpCode', required: false, type: Number }) 
    async getDemandsforallocation(
      @Query('userIndex') userIndex: number,
      @Query('districtcode') districtcode: number,
    ) {
      return this.demandService.getDemandsforallocation(userIndex, districtcode);
    }

    @Get('Summary_Report_on_Demand_for_Work')
    async getDemandStats() {
      return this.demandService.getDemandStats();
    }
}
