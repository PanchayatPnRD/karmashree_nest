import { Body, Controller, Post } from '@nestjs/common';
import { DemandService } from './demand.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDemandMasterDto } from './dto/demand.entity';

@ApiTags("demand")
@Controller('api/demand')
export class DemandController {
    constructor(private readonly demandService: DemandService) {}
    
    @Post('createDemand')
    async createDemand(@Body() createDto: CreateDemandMasterDto) {
        return await this.demandService.createDemand(createDto);
    }

}
