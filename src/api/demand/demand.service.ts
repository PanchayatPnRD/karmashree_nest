import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DemandMaster, MasterWorkerDemand_allotment, MasterWorkerDemand_allotmenthistroy } from 'src/entity/demandmaster.entity';
import { Repository } from 'typeorm';
import { CreateDemandMasterDto } from './dto/demand.entity';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector, pedestalMaster } from 'src/entity/mastertable.enity';

@Injectable()
export class DemandService {
    constructor(
        @InjectRepository(DemandMaster) private demandMaster: Repository<DemandMaster>,
        @InjectRepository(MasterWorkerDemand_allotment) private MasterWorkerDemandallotment: Repository<MasterWorkerDemand_allotment>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
       
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,
        @InjectRepository(MasterWorkerDemand_allotmenthistroy) private  Demandallotmenthistroy:Repository<MasterWorkerDemand_allotmenthistroy>,
        
        
    ) {}

    private generateEMPID(): string {
        const random6Digits = Math.floor(100000 + Math.random() * 900000).toString();
        return `DEMD${random6Digits}`;
    }
    
    async createDemand(createDto: CreateDemandMasterDto) {
        try {
            const created: DemandMaster[] = [];
            const masterAllotment: MasterWorkerDemand_allotment[] = [];
            let demand: string;
            for (const actionDto of createDto.DemandMasterDto) {
                const demanduniqueID = this.generateEMPID();
                const createdTreatment = this.demandMaster.create({
                    ...actionDto,
                    total_pending: actionDto.total_pending,
                    demanduniqueID,
                    workallostatus:"0"
                });
                await this.demandMaster.save(createdTreatment);
                created.push(createdTreatment);
                demand = demanduniqueID;
                const startDate = new Date(actionDto.dateOfApplicationForWork);
                
                for (let i = 0; i < actionDto.noOfDaysWorkDemanded; i++) {
                    const currentWorkDate = new Date(startDate);
                    currentWorkDate.setDate(startDate.getDate() + i);
    
                    const newMasterAllotment = this.MasterWorkerDemandallotment.create({
                        demanduniqueID: demand , // Generate a new ID for each allotment
                        schemeArea: actionDto.schemeArea,
                        departmentNo: actionDto.departmentNo,
                        districtcode: actionDto.districtcode,
                        municipalityCode: actionDto.municipalityCode,
                        blockcode: actionDto.blockcode,
                        gpCode: actionDto.gpCode,
                        workerJobCardNo: actionDto.workerJobCardNo,
                        dateofwork: currentWorkDate,
                        CurrentMonth_work: actionDto.currentMonth,
                        CurrentYear_work: actionDto.currentYear,
                        remark: actionDto.remark,
                        age: actionDto.age,
                    });
    
                    const createdMasterWorkerAllotment = await this.MasterWorkerDemandallotment.save(newMasterAllotment);
                    masterAllotment.push(createdMasterWorkerAllotment);
                }
            }
            
            return {
                errorCode: 0,
                message: "Demand Created Successfully",
                result: created,
                demand
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong: " + error.message,
            };
        }
    }


    async getdemandforallocation(blockcode: number, gpCode?: number) {
        try {
          let work;
    
          if (blockcode) {
            work = await this.demandMaster.find({ where: { blockcode, gpCode } });
          } else {
            work = await this.demandMaster.find({ where: { blockcode } });
          }
    
          return { errorCode: 0, result: work };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }

      async getdemandList(userIndex: number) {
        try {
            const demands = await this.demandMaster.createQueryBuilder('demand')
                .leftJoin('MasterWorkerDemand_allotmenthistroy', 'history', 'demand.demandsl = history.demandsl')
                .select([
                    'demand.*',
                    'history.empid',
                    'history.empStatus',
                    'history.workerJobCardNo',
                    'history.dateofwork',
                    'history.workAllotedstatus',
                    'history.finYear_work',
                    'history.allocationID',
                    'history.dateofallotmentfrom',
                    'history.dateofallotmentto',
                    'history.CurrentMonth_allot',
                    'history.CurrentYear_allot',
                    'history.finYear_allot',
                    'history.allotmentuserIndex',
                ])
                .where('demand.userIndex = :userIndex', { userIndex })
                .orderBy('demand.demandsl', 'DESC')
                .getRawMany();
    
            if (!demands || demands.length === 0) {
                return {
                    errorCode: 1,
                    message: 'Demands not found for the provided user index',
                };
            }
    
            const demandsWithDetails = [];
    
            await Promise.all(demands.map(async (demand) => {
                try {
                    const districtDetails = await this.getAllDistricts(demand.districtcode);
                    const districtName = districtDetails.result ? districtDetails.result.districtName : '';
    
                    const blockDetails = await this.getAllblock(demand.blockcode);
                    const blockName = blockDetails.result ? blockDetails.result.blockName : '';
    
                    const gpDetails = await this.getAllgp(demand.gpCode);
                    const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
                    const deptDetails = await this.getDepatmentbyid(demand.departmentNo);
                    const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
    
                    const muniDetails = await this.getmunibyid(demand.municipalityCode);
                    const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
    
                    demandsWithDetails.push({
                        ...demand,
                        districtName,
                        blockName,
                        gpName,
                        deptName,
                        muniName,
                        historyDetails: {
                            empid: demand.history_empid,
                            empStatus: demand.history_empStatus,
                            workerJobCardNo: demand.history_workerJobCardNo,
                            dateofwork: demand.history_dateofwork,
                            workAllotedstatus: demand.history_workAllotedstatus,
                            finYear_work: demand.history_finYear_work,
                            allocationID: demand.history_allocationID,
                            dateofallotmentfrom: demand.history_dateofallotmentfrom,
                            dateofallotmentto: demand.history_dateofallotmentto,
                            CurrentMonth_allot: demand.history_CurrentMonth_allot,
                            CurrentYear_allot: demand.history_CurrentYear_allot,
                            finYear_allot: demand.history_finYear_allot,
                            allotmentuserIndex: demand.history_allotmentuserIndex,
                        },
                    });
                } catch (error) {
                    console.error(`Failed to fetch details for demand with demandsl ${demand.demandsl}:`, error);
                }
            }));
    
            return {
                errorCode: 0,
                result: demandsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch demands from the database:', error);
            throw new Error('Failed to fetch demands from the database.');
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
    
    async getDepatmentbyid(departmentNo: number) {
      let dept; // Declare dept before the try block
    
    
          dept = await this.masterdepartment.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo"] });
      
    
     
    
        return { errorCode: 0, result: dept };
    
       
      }
    
      async getmunibyid(urbanCode: number) {
          let dept; // Declare dept before the try block
        
       
              dept = await this.masterurban.findOne({ where: { urbanCode },  select: ["urbanName","urbanCode"] });
          
        
         
        
            return { errorCode: 0, result: dept };
      
           
          }
    


          async getdemandListbyallocation_id(userIndex: number) {
            try {
                const demands = await this.demandMaster.find({ where: { userIndex },  order: { demandsl: 'DESC' }  });
        
                if (!demands || demands.length === 0) {
                    return {
                        errorCode: 1,
                        message: 'demands not found for the provided user index',
                    };
                }
        
                const demandsWithDetails = [];
        
                await Promise.all(demands.map(async (demand) => {
                    try {
                        const districtDetails = await this.getAllDistricts(demand.districtcode);
                        const districtName = districtDetails.result ? districtDetails.result.districtName : '';
        
                        const blockDetails = await this.getAllblock(demand.blockcode);
                        const blockname = blockDetails.result ? blockDetails.result.blockName : '';
        
                        const gpDetails = await this.getAllgp(demand.gpCode);
                        const gpName = gpDetails.result ? gpDetails.result.gpName : '';
        
                        const deptDetails = await this.getDepatmentbyid(demand.departmentNo);
                        const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
    
                        const muniDetails = await this.getmunibyid(demand.municipalityCode);
                        const muniName = muniDetails.result ? muniDetails.result.urbanName : '';
    
                        
        
                        demandsWithDetails.push({
                            ...demand,
                            districtName: districtName,
                            blockname: blockname,
                            gpName: gpName,
                            deptName: deptName,
                            muniName: muniName,
                        });
                    } catch (error) {
                        // Log the error for this contractor
                        console.error(`Failed to fetch details for contractor`);
                    }
                }));
        
                return {
                    errorCode: 0,
                    result: demandsWithDetails,
                };
            } catch (error) {
                console.error('Failed to fetch demands from the database:', error);
                throw new Error('Failed to fetch demands from the database.');
            }
        }

        
       // AND C.total_pending >= 0 AND C.workallostatus = 0
       // AND A.total_pending >= 0 AND A.workallostatus = 0
        // getDemandsforallocation(userIndex: number, districtcode: number) {

        
        
        async getDemandsforallocation(userIndex: number, districtcode: number) {
            try {
              // Manually construct the UNION query with parameters
              const query1 = `
                SELECT A.* FROM demand_master A
                WHERE A.userIndex = ? 
                AND  A.workallostatus = 0
              `;
              const query2 = `
                SELECT C.* FROM demand_master C
                WHERE C.userIndex != ? AND C.districtcode = ? 
                AND  C.workallostatus = 0
              `;
              const combinedQuery = `${query1} UNION ${query2}`;
          
              // Execute the combined query with parameters
              const demands = await this.demandMaster.query(combinedQuery, [userIndex, userIndex, districtcode]);
          
              // Map through each demand to fetch additional details
              const enrichedDemands = await Promise.all(
                demands.map(async (demand: any) => {
                  // Fetch and append additional details to each demand
                  const districtDetails = await this.getAllDistricts(demand.districtcode);
                  demand.districtName = districtDetails.result ? districtDetails.result.districtName : '';
          
                  const blockDetails = await this.getAllblock(demand.blockcode);
                  demand.blockName = blockDetails.result ? blockDetails.result.blockName : '';
          
                  const gpDetails = await this.getAllgp(demand.gpCode);
                  demand.gpName = gpDetails.result ? gpDetails.result.gpName : '';
          
                  const deptDetails = await this.getDepatmentbyid(demand.departmentNo);
                  demand.departmentName = deptDetails.result ? deptDetails.result.departmentName : '';
          
                  const muniDetails = await this.getmunibyid(demand.municipalityCode);
                  demand.municipalityName = muniDetails.result ? muniDetails.result.urbanName : '';
          
                  return demand;
                })
              );
          
              return {
                errorCode: 0,
                result: enrichedDemands,
              };
            } catch (error) {
              return {
                errorCode: 1,
                message: 'Something went wrong: ' + error.message,
              };
            }
          }
          

              async getDemandStats() {
                try {
                  const stats = await this.masterdepartment
                    .createQueryBuilder('masterdepartment')
                    .select([
                      'COUNT(DISTINCT demand_master.districtCode) AS totalNoOfDistricts',
                      `COUNT(CASE WHEN demand_master.schemeArea = 'U' AND (demand_master.municipalityCode != '' OR demand_master.municipalityCode != 0) THEN 1 END) AS totalNoOfMunicipalBodies`,
                      `COUNT(CASE WHEN demand_master.schemeArea = 'R' AND (demand_master.blockcode != '' OR demand_master.blockcode != 0) THEN 1 END) AS totalBlocks`,
                      `COUNT(CASE WHEN demand_master.schemeArea = 'R' AND (demand_master.gpCode != '' OR demand_master.gpCode != 0) THEN 1 END) AS totalGPs`,
                      'COUNT(DISTINCT demand_master.workerJobCardNo) AS cumulativeNoOfJobCardHoldersDemandForWork',
                      'COUNT(demand_master.workerJobCardNo) AS cumulativeNoOfJobCardHoldersDemandForWork',
                      `COUNT(CASE WHEN demand_master.gender = 'M' THEN 1 END) AS noOfMaleWorkers`,
                      `COUNT(CASE WHEN demand_master.gender = 'F' THEN 1 END) AS noOfFemaleWorkers`,
                      `COUNT(CASE WHEN demand_master.caste = 'SC' THEN 1 END) AS sc`,
                      `COUNT(CASE WHEN demand_master.caste = 'ST' THEN 1 END) AS st`,
                      `COUNT(CASE WHEN demand_master.caste = 'Others' THEN 1 END) AS others`,
                      `COUNT(CASE WHEN demand_master.whetherMinority = 'Y' THEN 1 END) AS minority`,
                      'SUM(demand_master.noOfDaysWorkDemanded) AS cumulativeNoOfMandaysDemanded',
                      `'0' AS cumulativeNoOfMandaysProvided`,
                      `'0' AS averageDaysOfEmploymentProvidedPerHH`
                    ])
                    .leftJoin('demand_master', 'demand_master', 'masterdepartment.departmentNo = demand_master.departmentNo')
                    .getRawOne();
            
                  return { errorCode: 0, result: stats };
                } catch (error) {
                  return { errorCode: 1, message: 'Something went wrong: ' + error.message };
                }
              }
}
