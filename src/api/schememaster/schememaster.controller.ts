import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SchememasterService } from './schememaster.service';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateMasterSchemeDTO } from './dto/updateschem.dto';


@ApiTags('schememaster')

@Controller('api/schememaster')
export class SchememasterController {
    constructor(private readonly masterSchemeService: SchememasterService) {}

    @ApiHeader({
      name: 'token',
    })
    @Post('createschememaster')
    async create(@Body() createMasterSchemeDto: MasterSchemeDTO) {
        return this.masterSchemeService.create(createMasterSchemeDto);
    }

    @ApiHeader({
      name: 'token',
    })
    @Get('schemeview/:scheme_sl')
    async getSchemeById(@Param('scheme_sl') scheme_sl: number) {
      return this.masterSchemeService.getSchemeById(scheme_sl);
    }

    @ApiHeader({
      name: 'token',
    })
    @Post('updateschme/:scheme_sl')
    async updateMasterScheme(
      @Param('scheme_sl') scheme_sl: number,
      @Body() updateMasterSchemeDto: UpdateMasterSchemeDTO,
     
    ) {
      return this.masterSchemeService.updateMasterScheme(scheme_sl, updateMasterSchemeDto);
    }
  
    @ApiHeader({
      name: 'token',
    })
    @Get('schemelist/:userIndex')
    async getMasterSchemeExpendituresByUserIndex(@Param('userIndex') userIndex: number) {
        try {
            const masterSchemeExpenditures = await this.masterSchemeService.getschemeList(userIndex);
            return masterSchemeExpenditures ;
        } catch (error) {
            return { success: false, message: 'Failed to fetch master scheme expenditures.', error };
        }
    }
    @ApiHeader({
      name: 'token',
    })
    @Get('getAllScheme/:userIndex')
    async getAllScheme(@Param('userIndex') userIndex: number){
        try{
            const scheme = await this.masterSchemeService.getAllScheme(userIndex)
            return scheme;
        }catch(error){
            return{ success:false,message:'Failed to fetch master scheme expenditrure.',error};
        }
    }
    @ApiHeader({
      name: 'token',
    })
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

    @Get('dashboard')
  async getCounts() {
    return this.masterSchemeService.getCounts();
  }

  @ApiHeader({
    name: 'token',
  })
  @Get('getactionplanreport')
  async getactionplanreport() {
    return this.masterSchemeService.getactionplanreport();
  }

  @ApiHeader({
    name: 'token',
  })
  @Get('Summary_Report_on_Annual_Action_Plan')
  async Summary_Report_on_Annual_Action_Plan() {
    return this.masterSchemeService.Summary_Report_on_Annual_Action_Plan();
  }

  @ApiHeader({
    name: 'token',
  })
  @Get('Summary_Report_on_Schemes')
  async getSummaryReport() {
    return await this.masterSchemeService.Summary_Report_on_Schemes();
  }
  @ApiHeader({
    name: 'token',
  })
  @Get('home_dashboard')
  async getSummaryReportHome() {
    return await this.masterSchemeService.getSummaryReportHome();
  }
  @ApiHeader({
    name: 'token',
  })
  @Get('funding-department-wise')
  async getFundingDepartmentWiseReport() {
    return await this.masterSchemeService.getFundingDepartmentWiseReport();
  }

}
