import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { WorkerrequisitionService } from './workerrequisition.service';
import { MasterWorkerRequirementDto } from './dto/worker.dto';

@ApiTags('workerrequisition')
@ApiHeader({
  name: 'token',
})
@Controller('api/workerrequisition')
export class WorkerrequisitionController {

    constructor(private readonly workerrequisitionService: WorkerrequisitionService) {}

    @Post('createworkerRequisition')
    async create(@Body() createMasterSchemeDto: MasterWorkerRequirementDto) {
        return this.workerrequisitionService.create(createMasterSchemeDto);
    }


    @Get('workerrequisitionlist')
  async getAllWork(@Query('districtcode') districtcode: number, @Query('blockcode') blockcode?: number) {
    try {
      const result = await this.workerrequisitionService.getallwork(districtcode, blockcode);
      return result;
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
  }

  @Get('getallrequztion')
  async getallrequztion(@Query('userIndex') userIndex: number) {
    try {
      const result = await this.workerrequisitionService.getallrequztion(userIndex);
      return result;
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
  }


  
}


  