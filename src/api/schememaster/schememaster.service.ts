import { Injectable } from '@nestjs/common';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { MasterScheme, MasterSchemeExpenduture } from 'src/entity/scheme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_zp, masterdepartment } from 'src/entity/mastertable.enity';
import { Contractor_master } from 'src/entity/contractor.entity';

@Injectable()
export class SchememasterService {
    constructor(
        @InjectRepository(MasterScheme)
        private  masterSchemeRepository: Repository<MasterScheme>,
        @InjectRepository(MasterSchemeExpenduture) private  MasterSchemeExpendutureRepository: Repository<MasterSchemeExpenduture>,
        @InjectRepository(Contractor_master) private Contractor: Repository<Contractor_master>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        
    ) {}

    async create(createMasterSchemeDto: MasterSchemeDTO): Promise<MasterScheme> {
        // Create MasterScheme entity from DTO
        const masterScheme = this.masterSchemeRepository.create(createMasterSchemeDto);
        
        // Save MasterScheme entity to database
        const savedMasterScheme = await this.masterSchemeRepository.save(masterScheme);
    
        // Create MasterSchemeExpenditure entity
        const masterSchemeExpenditure = new MasterSchemeExpenduture();
        masterSchemeExpenditure.schemeId = savedMasterScheme.scheme_sl; // Assuming there's a foreign key relationship between MasterScheme and MasterSchemeExpenditure
    
        await this.MasterSchemeExpendutureRepository.save(masterSchemeExpenditure);
    
        
        return savedMasterScheme;
    }
    
}
