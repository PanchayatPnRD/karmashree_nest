import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contractor_master } from 'src/entity/contractor.entity';
import { Repository } from 'typeorm';
import { CreateContractorDto } from './dto/contractor.dto';

@Injectable()
export class ContractorService {
    constructor(
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
    

      ) {}

 

    async createContractors(createContractorDto: CreateContractorDto) {
        try {
            function generateRandomNumber() {
                let range = {min: 1111, max: 9999}
                let delta = range.max - range.min
                
                const rand = Math.round(range.min + Math.random() * delta)
                return rand.toString(); 
              }

         
            const contractorUniqueNo = `C${createContractorDto.DepartmentNo}${createContractorDto.districtcode}${generateRandomNumber()}`;
    
            
            createContractorDto.contractor_uniqueNo = contractorUniqueNo;
    
        
            const contractor = this.Contractor.create(createContractorDto);
            await this.Contractor.save(contractor);
            return { errorCode: 0, message: 'Contractor plan created successfully' };
        } catch (error) {
            return { errorCode: 1, message: 'Failed to create action plan', error: error.message };
        }
    }

    async getAllContractors(){
        try {
            const contractors = await this.Contractor.find({ select: ['cont_sl', 'contractorGSTIN'] });

            return {
                errorCode: 0,
                result: contractors
            };
          
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }

    async getcontractorDetails(cont_sl:number){
        try {
            const contractors = await this.Contractor.find({ where: {cont_sl} });

            return {
                errorCode: 0,
                result: contractors
            };
          
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }
    async getcontractorList(userIndex:number){
        try {
            const contractors = await this.Contractor.find({ where: {userIndex} });

            return {
                errorCode: 0,
                result: contractors
            };
          
        } catch (error) {
            throw new Error('Failed to fetch contractors from the database.');
        }
    }
}
