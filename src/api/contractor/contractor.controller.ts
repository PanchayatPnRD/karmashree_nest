import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ContractorService } from './contractor.service';
import { CreateContractorDto } from './dto/contractor.dto';


@ApiTags('contractor')
@ApiHeader({
        name: 'token',
      })
@Controller('api/contractor')
export class ContractorController {

    constructor(private readonly ContractorService: ContractorService) {}





    @Post('createcontractor')
    async createContractors(@Body() data: CreateContractorDto) {
      return await this.ContractorService.createContractors(data);
    }




    @Get('masterContractorlist')
    async getAllContractors() {
    
            const contractors = await this.ContractorService.getAllContractors();
            return  contractors 
       
    }




    @Get('getcontractorDetails/:cont_sl')
    async getcontractorDetails(@Param('cont_sl') cont_sl: number) {
    
            const contractors = await this.ContractorService.getcontractorDetails(cont_sl);
            return  contractors 
       
    }

    @Get('getcontractorList/:userIndex')
    async getcontractorList(@Param('userIndex') userIndex: number) {
    
            const contractors = await this.ContractorService.getcontractorList(userIndex);
            return  contractors 
       
    }


    @Get('get_draft_Details/:userIndex')
    async get_draft_Details(@Param('userIndex') userIndex: number) {
    
            const contractors = await this.ContractorService.get_draft_Details(userIndex);
            return  contractors 
       
    }
    
  
}
