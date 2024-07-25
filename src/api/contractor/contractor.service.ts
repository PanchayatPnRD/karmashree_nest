import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master, Contractor_master_draft } from 'src/entity/contractor.entity';
import { Repository } from 'typeorm';
import { CreateContractorDto } from './dto/contractor.dto';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, mastersector } from 'src/entity/mastertable.enity';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';

@Injectable()
export class ContractorService {
    
    constructor(
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(master_urban) private masterurban: Repository<master_urban>,

        @InjectRepository(Contractor_master_draft) private Contractormasterdraft: Repository<Contractor_master_draft>,


      ) {}


    async createContractors(createContractorDto: CreateContractorDto) {
        try {
            function generateRandomNumber() {
                let range = {min: 1111, max: 9999}
                let delta = range.max - range.min
                
                const rand = Math.round(range.min + Math.random() * delta)
                return rand.toString(); 
              }

if(createContractorDto.is_draft==="1"){
    const contractorUniqueNo = `C${createContractorDto.DepartmentNo}${createContractorDto.districtcode}${generateRandomNumber()}`;

    createContractorDto.contractor_uniqueNo = contractorUniqueNo;


    const contractor = this.Contractormasterdraft.create(createContractorDto);

   
    await this.Contractormasterdraft.save(contractor);

    
}
else{
         
            const contractorUniqueNo = `C${createContractorDto.DepartmentNo}${createContractorDto.districtcode}${generateRandomNumber()}`;
    
            
            createContractorDto.contractor_uniqueNo = contractorUniqueNo;
    
        
            const contractor = this.Contractor.create(createContractorDto);

           
            await this.Contractor.save(contractor);

            await this.Contractormasterdraft.delete({ userIndex: createContractorDto.userIndex });

            // Create new draft entry
            // const contractorDraft = this.Contractormasterdraft.create(createContractorDto);
            // await this.Contractormasterdraft.save(contractorDraft);
}
            
            return { errorCode: 0, message: 'Contractor plan created successfully' };
        } catch (error) {
            return { errorCode: 1, message: 'Failed to create contractor', error: error.message };
        }
    }

    async get_draft_Details(userIndex: number) {
        try {
            const contractors = await this.Contractormasterdraft.findOne({ where: { userIndex },order:{cont_sl:'DESC'} });
    
            if (!contractors) {
                return {
                    errorCode: 1,
                    message: 'Contractor not found'
                };
            }
    
            const contractorDetails = {
                ...contractors,
            };
    
          //  const lastElement = Object.values(contractorDetails).pop();
    
            return {
                errorCode: 0,
                result: contractorDetails
            };
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }
    

    async getAllContractors(){
        try {
            const contractors = await this.Contractor.find({ select: ['cont_sl', 'contractorGSTIN', 'contractorName'] });

          
            const concatenatedContractors = contractors.map(contractor => {
                const contractorName = contractor.contractorName ? contractor.contractorName : '';
                const contractorNameGst = `${contractorName}-${contractor.contractorGSTIN}`;
                return { cont_sl: contractor.cont_sl, contractorNameGst };
            });

            return {
                errorCode: 0,
                result: concatenatedContractors,
            };
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }

    async getcontractorDetails(cont_sl:number){
        try {
            const contractors = await this.Contractor.findOne({ where: {cont_sl} });

            const districtDetails = await this.getAllDistricts(contractors.districtcode);
            const districtName = districtDetails.result ? districtDetails.result.districtName : '';
          
            const blockDetails = await this.getAllblock(contractors.blockcode);
            const blockname = blockDetails.result ? blockDetails.result.blockName : '';
            const gpDetails = await this.getAllgp(contractors.gpCode);
            const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
            const deptDetails = await this.getDepatmentbyid(contractors.DepartmentNo);
            const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

            const contractorDetails = {
                ...contractors,
                districtName: districtName,
             
                blockname: blockname,
                gpName: gpName,
                deptName:deptName,
              
    
            };
            return {
                errorCode: 0,
                result: contractorDetails
            };
          
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }


    async getcontractorList(userIndex: number) {
        try {
            const contractors = await this.Contractor.find({ where: { userIndex },order: { cont_sl: 'DESC' }  });
    
            if (!contractors || contractors.length === 0) {
                return {
                    errorCode: 1,
                    message: 'Contractors not found for the provided user index',
                };
            }
    
            const contractorsWithDetails = [];
    
            await Promise.all(contractors.map(async (contractor) => {
                try {
                    const districtDetails = await this.getAllDistricts(contractor.districtcode);
                    const districtName = districtDetails.result ? districtDetails.result.districtName : '';
    
                    const blockDetails = await this.getAllblock(contractor.blockcode);
                    const blockname = blockDetails.result ? blockDetails.result.blockName : '';
    
                    const gpDetails = await this.getAllgp(contractor.gpCode);
                    const gpName = gpDetails.result ? gpDetails.result.gpName : '';
    
                    const deptDetails = await this.getDepatmentbyid(contractor.DepartmentNo);
                    const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

                    const muniDetails = await this.getmunibyid(contractor.Municipality);
                    const muniName = muniDetails.result ? muniDetails.result.urbanName : '';

                    
    
                    contractorsWithDetails.push({
                        ...contractor,
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
                result: contractorsWithDetails,
            };
        } catch (error) {
            console.error('Failed to fetch contractors from the database:', error);
            throw new Error('Failed to fetch contractors from the database.');
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

    

}
