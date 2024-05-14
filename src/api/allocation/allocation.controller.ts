import { Body, Controller, Post } from '@nestjs/common';
import { CreateWorkAllocationDto } from './dto/allocation.dto';
import { ApiTags } from '@nestjs/swagger';
import { AllocationService } from './allocation.service';
import { WorkAllocation } from 'src/entity/workallocation.entity';



    @ApiTags("allocation")
@Controller('api/allocation')
export class AllocationController {

    constructor(private readonly allocationService: AllocationService) {}

    @Post('allocation')
    async create(@Body() createWorkAllocationDto: CreateWorkAllocationDto): Promise<{ errorCode: number, result: WorkAllocation[] }> {
        return this.allocationService.create(createWorkAllocationDto);
      }
}
