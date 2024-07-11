import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actionplan_master,  } from 'src/entity/actionplan.entity';
import { Repository } from 'typeorm';
import { CreateActionPlanDto } from './dto/actionplan.dto';
import { UpdateActionPlanDto } from './dto/actionplanupdate.dto';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
@Injectable()
export class ActionplanService {
    constructor(
        @InjectRepository(Actionplan_master) private actionplan: Repository<Actionplan_master>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(mastersector) private mastersector: Repository<mastersector>,
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        @InjectRepository(pedestalMaster) private pedestalMaster: Repository<pedestalMaster>,
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
        // Find action plan details by user index
        const actionplans = await this.actionplan.find({ where: { userIndex },order: { actionSL: 'DESC' } });

        if (!actionplans || actionplans.length === 0) {
            return {
                errorCode: 1,
                message: 'Action plans not found for the provided user index',
            };
        }

        // Array to store action plan details
        const actionPlansWithDetails = [];

        for (const actionplan of actionplans) {
            // Fetch additional details for each action plan
            const districtDetails = await this.getAllDistricts(actionplan.districtCode);
            const districtName = districtDetails.result ? districtDetails.result.districtName : '';
           
            const blockDetails = await this.getAllblock(actionplan.blockCode);
            const blockname = blockDetails.result ? blockDetails.result.blockName : '';
            
            const gpDetails = await this.getAllgp(actionplan.gpCode);
            const gpName = gpDetails.result ? gpDetails.result.gpName : '';
     
            const deptDetails = await this.getDepatmentbyid(actionplan.departmentNo);
            const deptName = deptDetails.result ? deptDetails.result.deptshort : '';

            const sectorDetails = await this.getSectorbyid(actionplan.schemeSector);
            const sectorName = sectorDetails.result ? sectorDetails.result.sectorname : '';

            const muniDetails = await this.getmunibyid(actionplan.municipalityCode);
            const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
           
            const pedastalId = parseInt(actionplan.pedastal, 10);

            // Pass the converted integer to the getpedabyid function if it's a valid number
            let pedaName = '';
            if (!isNaN(pedastalId)) {
                const pedaDetails = await this.getpedabyid(pedastalId);
                pedaName = pedaDetails.result ? pedaDetails.result.pedestalName : '';
            }


            
            // Push action plan with details into the array
            actionPlansWithDetails.push({
                ...actionplan,
                districtName: districtName,
                blockname: blockname,
                gpName: gpName,
                deptName: deptName,
                sectorName:sectorName,
                muniName:muniName,
                pedaName:pedaName
            });
        }

        // Return the array of action plans with details
        return {
            errorCode: 0,
            result: actionPlansWithDetails,
        };
    } catch (error) {
        return {
            errorCode: 1,
            message: 'Failed to retrieve action details: ' + error.message,
        };
    }
}

async getmunibyid(urbanCode: number) {
    let dept; // Declare dept before the try block
  
 
        dept = await this.masterurban.findOne({ where: { urbanCode },  select: ["urbanName","urbanCode"] });
    
  
   
  
      return { errorCode: 0, result: dept };

     
    }

    async getpedabyid(id: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.pedestalMaster.findOne({ where: { id },  select: ["pedestalName","id"] });
        
      
       
      
          return { errorCode: 0, result: dept };
    
         
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



  async getDepatmentbyid(departmentNo: number) {
    let dept; // Declare dept before the try block
  
 
        dept = await this.masterdepartment.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo","deptshort"] });
    
  
   
  
      return { errorCode: 0, result: dept };

     
    }

    async getSectorbyid(sectorid: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.mastersector.findOne({ where: { sectorid },  select: ["sectorname","sectorid"] });
        
      
       
      
          return { errorCode: 0, result: dept };
    
         
        }

async getActionPlanDetails(actionSL: number) {
    try {
        const existingActionPlan = await this.actionplan.findOne({ where: { actionSL }} );

        const districtDetails = await this.getAllDistricts(existingActionPlan.districtCode);
        const districtName = districtDetails.result ? districtDetails.result.districtName : '';
      
        const blockDetails = await this.getAllblock(existingActionPlan.blockCode);
        const blockname = blockDetails.result ? blockDetails.result.blockName : '';
        const gpDetails = await this.getAllgp(existingActionPlan.gpCode);
        const gpName = gpDetails.result ? gpDetails.result.gpName : '';

        const deptDetails = await this.getDepatmentbyid(existingActionPlan.departmentNo);
        const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

        const sectorDetails = await this.getSectorbyid(existingActionPlan.schemeSector);
            const sectorName = sectorDetails.result ? sectorDetails.result.sectorname : '';
        // Combine action plan details with additional information
        const actionPlanWithDetails = {
            ...existingActionPlan,
            districtName: districtName,
         
            blockname: blockname,
            gpName: gpName,
            deptName:deptName,
            sectorName:sectorName

        };

        return { 
            errorCode: 0, 
            message: 'Action successfully', 
            existingActionPlan: actionPlanWithDetails
        };
    } catch (error) {
        return { 
            errorCode: 1, 
            message: 'Failed to update action plan', 
            error: error.message 
        };
    }
}


  async getAllDistricts(districtCode: number) {
    try {
        let districtDetails;

        if (!districtCode || districtCode === 0) {
            // Handle the case when districtCode is empty or '0', if needed
            return { errorCode: 1, message: 'Invalid districtCode' };
        } else {
            districtDetails = await this.masterzp.findOne({ 
                where: { districtCode }, 
                select: ["districtName","districtCode"]
            });
        }

        return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
    } catch (error) {
        return {
            errorCode: 1,
            message: "Something went wrong while retrieving district details: " + error.message
        };
    }
}

async getAllsub(subdivCode: number) {
  try {
      let districtDetails;

      if (!subdivCode || subdivCode === 0) {
          // Handle the case when districtCode is empty or '0', if needed
          return { errorCode: 1, message: 'Invalid districtCode' };
      } else {
          districtDetails = await this.subdivision.findOne({ 
              where: { subdivCode }, 
              select: ["subdivName","subdivCode"]
          });
      }

      return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong while retrieving district details: " + error.message
      };
  }
}
async getAllblock(blockCode: number) {
try {
    let districtDetails;

    if (!blockCode || blockCode === 0) {
        // Handle the case when districtCode is empty or '0', if needed
        return { errorCode: 1, message: 'Invalid districtCode' };
    } else {
        districtDetails = await this.masterps.findOne({ 
            where: { blockCode }, 
            select: ["blockName","blockCode"]
        });
    }

    return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
} catch (error) {
    return {
        errorCode: 1,
        message: "Something went wrong while retrieving district details: " + error.message
    };
}
}

async getAllgp(gpCode: number) {
try {
  let districtDetails;

  if (!gpCode || gpCode === 0) {
      // Handle the case when districtCode is empty or '0', if needed
      return { errorCode: 1, message: 'Invalid districtCode' };
  } else {
      districtDetails = await this.grampanchayat.findOne({ 
          where: { gpCode }, 
          select: ["gpName","gpCode"],
      });
  }

  return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
} catch (error) {
  return {
      errorCode: 1,
      message: "Something went wrong while retrieving district details: " + error.message
  };
}
}

async getAggregatedData3() {
    try {
      const data = await this.actionplan
        .createQueryBuilder('actionPlan')
        .select('masterDepartment.departmentNo', 'departmentNo')
        .addSelect('masterDepartment.departmentName', 'departmentName')
        .addSelect('actionPlan.finYear', 'finYear')
        .addSelect('COUNT(DISTINCT actionPlan.districtCode)', 'TOTAL_DISTRICT_WORKING')
        .addSelect('COUNT(DISTINCT actionPlan.schemeSector)', 'TOTAL_SECTOR_WORKING')
        .addSelect('SUM(actionPlan.schemeProposed)', 'No_of_works_proposed')
        .addSelect('SUM(actionPlan.tentativeCostOfScheme)', 'Tentative_Total_Cost_of_works')
        .addSelect('SUM(actionPlan.totWagesPaid)', 'Tentative_Total_Wage_to_be_paid_in_the_works')
        .addSelect('SUM(actionPlan.totPersonDays)', 'Total_Persondays_to_be_generated')
        .addSelect('SUM(actionPlan.totJobCard)', 'Total_No_of_Job_Card_holders_to_be_engaged')
        .addSelect('SUM(actionPlan.totWagesPaid) / SUM(actionPlan.totJobCard)', 'Average_Days_of_Employment_to_be_provided_per_family')
        .leftJoin(masterdepartment, 'masterDepartment', 'masterDepartment.departmentNo = actionPlan.departmentNo')
        .groupBy('masterDepartment.departmentNo')
        .addGroupBy('masterDepartment.departmentName')
        .addGroupBy('actionPlan.finYear')
        .orderBy('masterDepartment.departmentName', 'ASC')
        .getRawMany();

      return { errorCode: 0, result: data };
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong: ' + error.message };
    }
  }

async getAggregatedData() {
    try {
      const data = await this.actionplan
        .createQueryBuilder('actionPlan')
        .select('actionPlan.departmentNo', 'actionPlanDepartmentNo')
        .addSelect('actionPlan.finYear', 'finYear')
        .addSelect('actionPlan.districtCode', 'districtCode')
        .addSelect('masterDepartment.departmentNo', 'departmentNo')
        .addSelect('masterDepartment.departmentName', 'departmentName')
        .addSelect('masterZP.districtCode', 'districtCode')
        .addSelect('masterZP.districtName', 'districtName')
        .addSelect('COUNT(DISTINCT actionPlan.schemeSector)', 'TOTAL_SECTOR_WORKING')
        .addSelect('SUM(actionPlan.schemeProposed)', 'No_of_works_proposed')
        .addSelect('SUM(actionPlan.tentativeCostOfScheme)', 'Tentative_Total_Cost_of_works')
        .addSelect('SUM(actionPlan.totWagesPaid)', 'Tentative_Total_Wage_to_be_paid_in_the_works')
        .addSelect('SUM(actionPlan.totPersonDays)', 'Total_Persondays_to_be_generated')
        .addSelect('SUM(actionPlan.totJobCard)', 'Total_No_of_Job_Card_holders_to_be_engaged')
        .addSelect('SUM(actionPlan.totWagesPaid) / SUM(actionPlan.totJobCard)', 'Average_Days_of_Employment_to_be_provided_per_family')
        .leftJoin(masterdepartment, 'masterDepartment', 'masterDepartment.departmentNo = actionPlan.departmentNo')
        .leftJoin(master_zp, 'masterZP', 'masterZP.districtCode = actionPlan.districtCode')
        .groupBy('actionPlan.departmentNo')
        .addGroupBy('actionPlan.finYear')
        .addGroupBy('actionPlan.districtCode')
        .addGroupBy('masterDepartment.departmentNo')
        .addGroupBy('masterDepartment.departmentName')
        .addGroupBy('masterZP.districtCode')
        .addGroupBy('masterZP.districtName')
        .orderBy('masterDepartment.departmentName', 'ASC')
        .addOrderBy('masterZP.districtName', 'ASC')
        .getRawMany();

      return { errorCode: 0, result: data };
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong: ' + error.message };
    }
  }


  async getAggregatedData2() {
    try {
      const data = await this.actionplan
        .createQueryBuilder('actionPlan')
        .select('masterDepartment.departmentNo', 'departmentNo')
        .addSelect('masterDepartment.departmentName', 'departmentName')
        .addSelect('pedestalMaster.pedestalName', 'pedestalName')
        .addSelect('actionPlan.finYear', 'finYear')
        .addSelect('masterZP.districtCode', 'districtCode')
        .addSelect('masterZP.districtName', 'districtName')
        .addSelect('COUNT(DISTINCT actionPlan.schemeSector)', 'TOTAL_SECTOR_WORKING')
        .addSelect('SUM(actionPlan.schemeProposed)', 'No_of_works_proposed')
        .addSelect('SUM(actionPlan.tentativeCostOfScheme)', 'Tentative_Total_Cost_of_works')
        .addSelect('SUM(actionPlan.totWagesPaid)', 'Tentative_Total_Wage_to_be_paid_in_the_works')
        .addSelect('SUM(actionPlan.totPersonDays)', 'Total_Persondays_to_be_generated')
        .addSelect('SUM(actionPlan.totJobCard)', 'Total_No_of_Job_Card_holders_to_be_engaged')
        .addSelect('SUM(actionPlan.totWagesPaid) / SUM(actionPlan.totJobCard)', 'Average_Days_of_Employment_to_be_provided_per_family')
        .leftJoin(masterdepartment, 'masterDepartment', 'masterDepartment.departmentNo = actionPlan.departmentNo')
        .leftJoin(pedestalMaster, 'pedestalMaster', 'masterDepartment.departmentNo = pedestalMaster.departmentNo')
        .leftJoin(master_zp, 'masterZP', 'actionPlan.districtCode = masterZP.districtCode')
        .groupBy('masterDepartment.departmentNo')
        .addGroupBy('masterDepartment.departmentName')
        .addGroupBy('pedestalMaster.pedestalName')
        .addGroupBy('actionPlan.finYear')
        .addGroupBy('masterZP.districtCode')
        .addGroupBy('masterZP.districtName')
        .orderBy('masterDepartment.departmentName', 'ASC')
        .addOrderBy('masterZP.districtName', 'ASC')
        .getRawMany();

      return { errorCode: 0, result: data };
    } catch (error) {
      return { errorCode: 1, message: 'Something went wrong: ' + error.message };
    }
  }


  


  async getactionplanlist_1(category: string,
    dno_status?: string,
     departmentNo?: number, 
     districtCode?: number,
      blockcode?: number,
      subDivision?:number,
       gpCode?: number,
        deptWing?: string,
        role?:number,
        userIndex?:number) {
   try {

     if (category === 'HQ') {

        const query = this.masterdepartment
        .createQueryBuilder('masterdepartment')
        .select('masterdepartment.departmentName', 'departmentName')
        .addSelect('masterdepartment.departmentNo', 'departmentCode')
        .addSelect('COUNT(master_scheme.schemeId)', 'Total_scheme')
        .addSelect('COUNT(master_scheme.schemeSector)', 'Total_sector')
        .addSelect('SUM(master_scheme.totalprojectCost)', 'Total_Cost')
        .addSelect('SUM(master_scheme_expenditure.totalWageCost)', 'Total_Spent')
        .addSelect('SUM(master_scheme_expenditure.totalUnskilledWorkers)', 'Total_worker')
        .addSelect('SUM(master_scheme_expenditure.personDaysGenerated)', 'Total_Mandays')
        .leftJoin(MasterScheme, 'master_scheme', 'masterdepartment.departmentNo = master_scheme.fundingDeptId')
        .leftJoin(MasterSchemeExpenduture, 'master_scheme_expenditure', 'master_scheme.schemeId = master_scheme_expenditure.schemeId AND masterdepartment.departmentNo = master_scheme_expenditure.fundingDeptId')
        .groupBy('masterdepartment.departmentName')
        .addGroupBy('masterdepartment.departmentNo')
        .orderBy('masterdepartment.departmentName', 'ASC')
        .getRawMany();
  
    

      return { errorCode: 0, result: query };



     } else if (category === 'HD' && deptWing !== '0') {
       
        const query = this.masterdepartment
        .createQueryBuilder('masterdepartment')
        .select('masterdepartment.departmentName', 'departmentName')
        .addSelect('masterdepartment.departmentNo', 'departmentCode')
        .addSelect('pedestal_master.pedestalName', 'pedestalName')
        .addSelect('COUNT(master_scheme.schemeId)', 'Total_scheme')
        .addSelect('COUNT(master_scheme.schemeSector)', 'Total_sector')
        .addSelect('SUM(master_scheme.totalprojectCost)', 'Total_Cost')
        .addSelect('SUM(master_scheme_expenditure.totalWageCost)', 'Total_Spent')
        .addSelect('SUM(master_scheme_expenditure.totalUnskilledWorkers)', 'Total_worker')
        .addSelect('SUM(master_scheme_expenditure.personDaysGenerated)', 'Total_Mandays')
        .innerJoin('masterdepartment.pedestals', 'pedestal_master')
        .leftJoin('masterdepartment.schemes', 'master_scheme')
        .leftJoin('master_scheme.expenditures', 'master_scheme_expenditure')
        .groupBy('masterdepartment.departmentName')
        .addGroupBy('masterdepartment.departmentNo')
        .addGroupBy('pedestal_master.pedestalName')
        .orderBy('masterdepartment.departmentName', 'ASC')
        .getRawMany();
  
        return { errorCode: 0, result: query };

      
           } else if (category === 'HD' && deptWing === '0') {
            const query = this.masterzp
            .createQueryBuilder('master_zp')
            .leftJoinAndSelect('master_zp.master_scheme', 'master_scheme')
            .leftJoinAndSelect('master_scheme.master_scheme_expenduture', 'master_scheme_expenduture')
            .select('master_zp.districtCode', 'districtCode')
            .addSelect('master_zp.districtName', 'districtName')
            .addSelect('COUNT(master_scheme.schemeId)', 'Total_scheme')
            .addSelect('COUNT(master_scheme.schemeSector)', 'Total_sector')
            .addSelect('SUM(master_scheme.totalprojectCost)', 'Total_Cost')
            .addSelect('SUM(master_scheme_expenduture.totalWageCost)', 'Total_Spent')
            .addSelect('SUM(master_scheme_expenduture.totalUnskilledWorkers)', 'Total_worker')
            .addSelect('SUM(master_scheme_expenduture.personDaysGenerated)', 'Total_Mandays')
            .groupBy('master_zp.districtCode')
            .addGroupBy('master_zp.districtName')
            .orderBy('master_zp.districtName', 'ASC')
            .getRawMany();
            return { errorCode: 0, result: query };
        }
  
    

   


     else {
       return { errorCode: 1, message: 'Invalid category provided' };
     }

   
     
   } catch (error) {
     return { errorCode: 1, message: 'Something went wrong', error: error.message };
   }
 }
 

}
