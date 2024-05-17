import { Body, Controller, Post } from '@nestjs/common';
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
}
