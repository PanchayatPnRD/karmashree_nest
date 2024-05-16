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


}
