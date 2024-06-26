import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateWorkAllocationDto } from './dto/allocation.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AllocationService } from './allocation.service';
import { WorkAllocation } from 'src/entity/workallocation.entity';



    @ApiTags("allocation")
    @ApiHeader({
        name: 'token',
      })
@Controller('api/allocation')
export class AllocationController {

    constructor(private readonly allocationService: AllocationService) {}

    @Post('allocation')
    async create(@Body() createWorkAllocationDto: CreateWorkAllocationDto) {
        return this.allocationService.create(createWorkAllocationDto);
      }

      @Get('getallocationList/:userIndex')
      async getallocationList(@Param('userIndex') userIndex: number) {
      
              const allo = await this.allocationService.getallocationList(userIndex);
              return  allo 
         
      }
      @Get('getallocationListforemp/:userIndex')
      async getallocationListforemp(@Param('userIndex') userIndex: number) {
      
              const allo = await this.allocationService.getallocationListforemp(userIndex);
              return  allo 
         
      }
   
      
      
    //   @Get('demandslistforallocation/:scheme_sl')
    //   async getDemandsByScheme(@Param('scheme_sl') scheme_sl: number) {
    //       return this.allocationService.getDemandByScheme(scheme_sl);
    //   }

      @Get('allocationempfinallist/:workAllocationID')
      async allocationempfinalliat(@Param('workAllocationID') workAllocationID: string) {
      
              const allo = await this.allocationService.allocationempfinalliat(workAllocationID);
              return  allo 
         
      }

      @Get('getallocationdemandview/:allocationID')
    async getAllocationDemandView(@Param('allocationID') allocationID: string) {
        try {
            const result = await this.allocationService.getallocationdemandview(allocationID);
            return result;
        } catch (error) {
            return { errorCode: 1, message: 'Internal server error' };
        }
    }
}
