import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SchememasterService } from './schememaster.service';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { ApiExcludeEndpoint, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateMasterSchemeDTO } from './dto/updateschem.dto';
import { ApiKeyGuard } from '../auth/api-key.guard';


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
    @Get('schemeview/:scheme_sl')
    async getSchemeById(@Param('scheme_sl') scheme_sl: number) {
      return this.masterSchemeService.getSchemeById(scheme_sl);
    }
    @Post('updateschme/:scheme_sl')
    async updateMasterScheme(
      @Param('scheme_sl') scheme_sl: number,
      @Body() updateMasterSchemeDto: UpdateMasterSchemeDTO,
     
    ) {
      return this.masterSchemeService.updateMasterScheme(scheme_sl, updateMasterSchemeDto);
    }

    @Get('getAllSchemerequizition')
    @ApiQuery({ name: 'gpCode', required: false, type: Number }) 
    @ApiQuery({ name: 'blockcode', required: false, type: Number }) 
    @ApiQuery({ name: 'municipalityCode', required: false, type: Number }) 
    async getAllSchemerequizition(@Query('districtcode') districtcode: number,@Query('blockcode') blockcode?: number, @Query('gpCode') gpCode?: number,@Query('municipalityCode' ) municipalityCode?: number){

        try{
            const scheme = await this.masterSchemeService.getAllSchemerequizition(districtcode,blockcode,gpCode,municipalityCode)
            return scheme;
        }catch(error){
            return{ success:false,message:'Failed to fetch master scheme expenditrure.',error};
        }
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


    
    @Get('getAllScheme/:userIndex')
    async getAllScheme(@Param('userIndex') userIndex: number){
        try{
            const scheme = await this.masterSchemeService.getAllScheme(userIndex)
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

 

    @Get('dashboard')
    @ApiQuery({ name: 'dno_status', required: false, type: String }) 
    @ApiQuery({ name: 'departmentNo', required: false, type: Number }) 
    @ApiQuery({ name: 'districtCode', required: false, type: Number }) 
    async getCounts(
      @Query('category') category: string,
      @Query('dno_status') dno_status: string,
@Query('departmentNo') departmentNo: number,
      @Query('districtCode') districtCode: number,
      @Query('blockcode')blockcode:number,
      @Query('gpCode')gpCode:number

      
    ) {
      try {
        const result = await this.masterSchemeService.getCounts(category, dno_status, departmentNo, districtCode,blockcode,gpCode);
        return result;
      } catch (error) {
        return { errorCode: 1, message: 'Failed to fetch counts', error: error.message };
      }
    }
  
  @Get('getactionplanreport')
  async getactionplanreport() {
    return this.masterSchemeService.getactionplanreport();
  }

  @Get('Summary_Report_on_Annual_Action_Plan')
  async Summary_Report_on_Annual_Action_Plan() {
    return this.masterSchemeService.Summary_Report_on_Annual_Action_Plan();
  }

  @Get('Summary_Report_on_Schemes')
  async getSummaryReport() {
    return await this.masterSchemeService.Summary_Report_on_Schemes();
  }

  @UseGuards(ApiKeyGuard)
  @ApiHeader({ name: 'x-api-key' })
  @Get('home_dashboard')
  async getSummaryReportHome() {
    return await this.masterSchemeService.getSummaryReportHome();
  }

  @Get('funding-department-wise')
  async getFundingDepartmentWiseReport() {
    return await this.masterSchemeService.getFundingDepartmentWiseReport();
  }


  @Get('masterscheme_2024_2025')
  @ApiQuery({ name: 'departmentNo', required: false, type: Number }) 
  @ApiQuery({ name: 'blockcode', required: false, type: Number }) 
  @ApiQuery({ name: 'gpCode', required: false, type: Number }) 
  @ApiQuery({ name: 'municipalityCode', required: false, type: Number }) 
  async getMasterSchemeOld(
    @Query('schemeArea') schemeArea: string,
    @Query('districtcode') districtcode: string,
    @Query('blockcode') blockcode?: string,
    @Query('gpCode') gpCode?: string,
    @Query('departmentNo') departmentNo?: number,
    @Query('municipalityCode')municipalityCode?:number,
  ) {
    return this.masterSchemeService.masterschemeold(schemeArea,districtcode, blockcode, gpCode, departmentNo,municipalityCode);
  }


  
  @Get('get_scheme_draft_Details/:userIndex')
  async get_draft_Details(@Param('userIndex') userIndex: number) {
  
          const contractors = await this.masterSchemeService.get_draft_Details(userIndex);
          return  contractors 
     
  }
  

}
