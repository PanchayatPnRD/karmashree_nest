import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkerrequisitionService } from './workerrequisition.service';
import { MasterWorkerRequirementDto } from './dto/worker.dto';

@ApiTags('workerrequisition')
@Controller('api/workerrequisition')
export class WorkerrequisitionController {

    constructor(private readonly workerrequisitionService: WorkerrequisitionService) {}

    @Post('createworkerRequisition')
    async create(@Body() createMasterSchemeDto: MasterWorkerRequirementDto) {
        return this.workerrequisitionService.create(createMasterSchemeDto);
    }

}


  