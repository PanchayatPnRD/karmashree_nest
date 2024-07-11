import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ActionplanService } from './actionplan.service';
import { CreateActionPlanDto } from './dto/actionplan.dto';
import { UpdateActionPlanDto } from './dto/actionplanupdate.dto';

@ApiTags("Actionplan")
@ApiHeader({
  name: 'token',
})
@Controller('api/actionplan')
export class ActionplanController {

        constructor(private readonly actionplanService: ActionplanService) {}



    @Post('create-actionplan') 
    async createActionPlan(@Body() createActionPlanDto: CreateActionPlanDto) {
        return this.actionplanService.createActionPlan(createActionPlanDto);
    }


    @Get('getActionList/:userIndex')
    async getActionDetails (@Param('userIndex') userIndex: number)
    {
      return await this.actionplanService.getActionDetails(userIndex);
    }

    @Post('update_actionplan/:actionSL')
    async updateActionPlan(@Body() updateActionPlanDto: UpdateActionPlanDto, @Param('actionSL') actionSL: number) {
        return this.actionplanService.updateActionPlan(actionSL, updateActionPlanDto);
    }

    @Get('actiondetails/:actionSL')
    async getActionPlanDetails(@Param('actionSL') actionSL: number)
     {
        
        return  await this.actionplanService.getActionPlanDetails(actionSL);
     }

     @Get('Action_Plan_Report-1')
     async getAggregatedData3() {
       const response = await this.actionplanService.getAggregatedData3();
       return response;
     }

     

     @Get('Action_Plan_Report-2')
     async getAggregatedData() {
       const response = await this.actionplanService.getAggregatedData();
       return response;
     }

     @Get('Action_Plan_Report-3')
     async getAggregatedData2() {
       const response = await this.actionplanService.getAggregatedData2();
       return response;
     }


     @Get('getactionplanlist_1')

  async getactionplanlist_1(
    @Query('category') category: string,
    @Query('dno_status') dno_status?: string,
    @Query('departmentNo') departmentNo?: number,
    @Query('districtCode') districtCode?: number,
    @Query('blockcode') blockcode?: number,
    @Query('subDivision') subDivision?: number,
    @Query('gpCode') gpCode?: number,
    @Query('deptWing') deptWing?: string,
    @Query('role') role?: number,
    @Query('userIndex') userIndex?: number,
  ) {
    try {
      const users = await this.actionplanService.getactionplanlist_1(
        category,
        dno_status,
        departmentNo,
        districtCode,
        blockcode,
        subDivision,
        gpCode,
        deptWing,
        role,
        userIndex,
      );
      return users
      
    } catch (error) {
      return {
        errorCode: 1,
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }
}
