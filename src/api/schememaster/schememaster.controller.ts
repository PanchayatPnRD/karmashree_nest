import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SchememasterService } from './schememaster.service';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';


@ApiTags('schememaster')
@ApiHeader({
    name: 'token',
  })
@Controller('api/schememaster')
export class SchememasterController {
    constructor(private readonly masterSchemeService: SchememasterService) {}

    @Post('createschememaster')
    async create(@Body() createMasterSchemeDto: MasterSchemeDTO) {
        return this.masterSchemeService.create(createMasterSchemeDto);
    }
    @Get('schemelist/:userIndex')
    async getMasterSchemeExpendituresByUserIndex(@Param('userIndex') userIndex: number) {
        try {
            const masterSchemeExpenditures = await this.masterSchemeService.getschemeList(userIndex);
            return masterSchemeExpenditures ;
        } catch (error) {
            return { success: false, message: 'Failed to fetch master scheme expenditures.', error };
        }
    }

    @Get('getAllScheme')
    async getAllScheme(){
        try{
            const scheme = await this.masterSchemeService.getAllScheme()
            return scheme;
        }catch(error){
            return{ success:false,message:'Failed to fetch master scheme expenditrure.',error};
        }
    }
    @Get('getschmeforallocation')
    @ApiQuery({ name: 'gpCode', required: false, type: Number }) 
    async getschmeforallocation(@Query('blockcode') blockcode: number, @Query('gpCode') gpCode?: number) {
      try {
        const result = await this.masterSchemeService.getschmeforallocation(blockcode, gpCode);
        return result;
      } catch (error) {
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
    }
}
