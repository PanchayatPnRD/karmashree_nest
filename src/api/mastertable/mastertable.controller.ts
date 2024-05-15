import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common';
import { MastertableService } from './mastertable.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeptDto, DesignationDto, PedestalDto, RoleDto, SectorDto } from './dto/role.dto';
import { UpdateDto, UpdatePedestalDto } from './dto/updatemaster.dto';
@ApiTags('Mastertables')

@Controller('api/mastertable')



export class MastertableController {

    constructor(private readonly mastertableService: MastertableService) {}

    @Post('createRole')
    async createRole(@Body() data: RoleDto) {
      return await this.mastertableService.createRole(data);
    }
  
   
    @Get('roles')
    async getAllRole() {
      return await this.mastertableService.getAllRoles();
    }
       
    @Get('getAllDistrictsaction')
    async getAllDistrictsaction() {
      return await this.mastertableService.getAllDistrictsaction();
    }

    @Get('GetAllDistricts/:districtCode')
    async getAllDistricts(@Param('districtCode') districtCode: number) {
      return await this.mastertableService.getAllDistricts(districtCode);
    }
    // @Get('getSubdivison/:districtCode') 
    // async getSubdivison(@Param('districtCode') districtCode: string) {
    //   return this.mastertableService.getSubdivison(districtCode); 
    // }

    @Get('getSubdivison/:districtCode/:subdivCode')
    async getSubdivison(
      @Param('districtCode') districtCode: number,
      @Param('subdivCode') subdivCode: number
    ) {
      return this.mastertableService.getSubdivison(districtCode, subdivCode);
    }


    @Get('getBlock/:districtCode/:blockCode') 
    async getBlock(@Param('districtCode') districtCode: number,
      @Param('blockCode') blockCode: number) {
      return this.mastertableService.getBlock(districtCode,blockCode); 
    }

    @Get('getBlockaction/:districtCode') 
    async getBlockaction(@Param('districtCode') districtCode: number) {
      return this.mastertableService.getBlockaction(districtCode); 
    }

    @Get('getGp/:districtCode/:blockCode/:gpCode')
    async getGp(@Param('districtCode') districtCode: number, @Param('blockCode') blockCode: number,@Param('gpCode') gpCode: number) {
      try {
        const result = await this.mastertableService.getGp(districtCode, blockCode,gpCode);
        return result;
      } catch (error) {
        return { errorCode: 1, message: 'Internal Server Error' };
      }
    }
    @Get('getGpaction/:districtCode/:blockCode')
    async getGpaction(@Param('districtCode') districtCode: number, @Param('blockCode') blockCode: number) {
      try {
        const result = await this.mastertableService.getGpaction(districtCode, blockCode);
        return result;
      } catch (error) {
        return { errorCode: 1, message: 'Internal Server Error' };
      }
    }
   
    @Get('getDepatmentlist')
    async getDepatment() {
      return await this.mastertableService.getDepatment();
    }

    @Get('getSectorlist')
    async getSector() {
      return await this.mastertableService.getSector();
    }
    @Post('createSector')
    async createSector(@Body() data: SectorDto) {
      return await this.mastertableService.createSector(data);
    }
  
 @Get('getMunicipality/:districtCode/:urbanCode')
    async getMunicipality(@Param('districtCode') districtCode: number,@Param('urbanCode') urbanCode:number ) {
        try {
            const result = await this.mastertableService.getMunicipality(districtCode,urbanCode);
            return result;
        } catch (error) {
            return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
    }
    
    @Get('GetDeptbyId/:departmentNo') // Define the route parameter here
    
    async getDepartment(@Param('departmentNo') departmentNo: number) {
      return await this.mastertableService.getDepatmentbyid(departmentNo);
    }


    // @Get('Getdesignation/:designationLevel')
    // async getDesignationByCategory(@Param('designationLevel') designationLevel: string) {
    //     try {   
    //         const dept = await this.mastertableService.getdesignationbycatagory(designationLevel);
            
    //         if (!dept) {
    //             return { errorCode: 1, message: 'Department not found' };
    //         }
            
    //         return { errorCode: 0, result: dept };
    //     } catch (error) {
    //         return { errorCode: 1, message: 'Something went wrong', error: error.message };
    //     }
    // }


    @Get('Getdesignation/:designationLevel')
    async getAllDesignations(@Param('designationLevel') designationLevel: string) {
      try {   
        const dept = await this.mastertableService.getdesignationbycatagory(designationLevel);
        
        if (!dept) {
          return { errorCode: 1, message: 'Departments not found' };
        }
        
        return { errorCode: 0, result: dept };
      } catch (error) {
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
    }

    @Post('createDesignation')
    async createDesignation(@Body() data: DesignationDto) {
      return await this.mastertableService.createDesignation(data);
    }
  
    @Get('DesignationList')
    async listDesignations() {
      return await this.mastertableService.listDesignations();
    }
  
    @Put('UpdateDesigntion:designationId')
    async updateDesignation(@Param('designationId') designationId: number, @Body() data: DesignationDto) {
      return await this.mastertableService.updateDesignation(designationId, data);
    }

    @Post('UpdateDepartment/:departmentNo')
    async updateDept(@Param('departmentNo') departmentNo: number, @Body() data: UpdateDto) {
      return await this.mastertableService.updateDept(departmentNo, data);
    }

    @Post('createDepartment')
    async createDepartment(@Body() data: DeptDto) {
      return await this.mastertableService.createDepartment(data);
    }
  
    @Get('DepartmentList')
    async listDepatemt() {
      return await this.mastertableService.listDepatemt();
    }

    @Get('getpdf/:id') 
    
    async getpdf(@Param('id') id: number) {
      return await this.mastertableService.getpdf(id);
    }

    @Get('getonlyGp/:gpCode')
    async getonlyGp(@Param('gpCode') gpCode: number) {
      return await this.mastertableService.getonlyGp(gpCode);

  }
  
  @Get('getdesignationfordnogp/:designationIds')
    async getDesignationForNoGP(@Param('designationIds', new ParseArrayPipe({ items: Number })) designationIds: number[]) {
        try {
            if (!designationIds || !Array.isArray(designationIds)) {
                return { errorCode: 1, message: 'Invalid or missing designationIds' };
            }

            const result = await this.mastertableService.getdesignationfordnogp(designationIds);

            return result;
        } catch (error) {
            console.error('Error in getDesignationForNoGP controller:', error);
            return { errorCode: 1, message: 'Internal server error' };
        }
    }
    
    @Post('createPedestal')
    async createPedestal(@Body() data: PedestalDto) {
      return await this.mastertableService.createPedestal(data);
    }
  
    @Get('getAllPedestal/:departmentNo/:id')
    async getAllPedestal(
      @Param('departmentNo') departmentNo: string,
      @Param('id') id: number
    ) {
      return await this.mastertableService.getAllPedestal(departmentNo, id);
    }
    

    @Post('updatePedestal/:id')
    async updatePedestal(@Param('id') id: number, @Body() data: UpdatePedestalDto) {
      return await this.mastertableService.updatePedestal(id, data);
    }


    @Get('PedestalList')
    async PedestalList() {
      return await this.mastertableService.PedestalList();
    }


    @Get('NrgsCode/:gpCode')
    async getJobCard(@Param('gpCode') gpCode: number) {
      try {
        const subdiv = await this.mastertableService.getjobcard(gpCode);

         return subdiv;
      } catch (error) {
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
    }

}