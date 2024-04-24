import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actionplan_master,  } from 'src/entity/actionplan.entity';
import { Repository } from 'typeorm';
import { CreateActionPlanDto } from './dto/actionplan.dto';
import { UpdateActionPlanDto } from './dto/actionplanupdate.dto';
@Injectable()
export class ActionplanService {
    constructor(
        @InjectRepository(Actionplan_master) private actionplan: Repository<Actionplan_master>,
      ) {}


    async createActionPlan(createActionPlanDto: CreateActionPlanDto) {
      try {
          const actionPlan = this.actionplan.create(createActionPlanDto);
          await this.actionplan.save(actionPlan);
          return { errorCode: 0, message: 'Action plan created successfully' };
      } catch (error) {
          return { errorCode: 1, message: 'Failed to create action plan', error: error.message };
      }
  }

  async getActionDetails(userIndex: number) {
    try {
      let actionplan
         actionplan = await this.actionplan.find({where: {userIndex}});


        return {
            errorCode: 0,
            result:  actionplan
            
        };
    } catch (error) {
        return {
            errorCode: 1,
            message: 'Failed to retrieve action details: ' + error.message,
        };
    }
}
async updateActionPlan(actionSL: number, updateActionPlanDto: UpdateActionPlanDto) {
  try {
      const existingActionPlan = await this.actionplan.findOne({ where: { actionSL }} );

      if (!existingActionPlan) {
          return { errorCode: 1, message: 'Action plan not found' };
      }

  
      Object.assign(existingActionPlan, updateActionPlanDto);

      await this.actionplan.save(existingActionPlan);

      return { errorCode: 0, message: 'Action plan updated successfully' };
  } catch (error) {
      return { errorCode: 1, message: 'Failed to update action plan', error: error.message };
  }
}


async getActionPlanDetails(actionSL: number) {
    try {
        const existingActionPlan = await this.actionplan.findOne({ where: { actionSL }} );

        return { errorCode: 0, message: 'Action successfully', existingActionPlan: existingActionPlan  };
    } catch (error) {
        return { errorCode: 1, message: 'Failed to update action plan', error: error.message };
    }
  }

  

  

}
