import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchememasterService } from './schememaster.service';
import { MasterSchemeDTO } from './dto/scheme.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('schememaster')

@Controller('api/schememaster')
export class SchememasterController {
    constructor(private readonly masterSchemeService: SchememasterService) {}

    @Post('createschememaster')
    async create(@Body() createMasterSchemeDto: MasterSchemeDTO) {
        return this.masterSchemeService.create(createMasterSchemeDto);
    }
    @Get('schemelist/:userIndex')
    async getMasterSchemeExpendituresByUserIndex(@Param('userIndex') userIndex: number) {
        try {
            const masterSchemeExpenditures = await this.masterSchemeService.findByUserIndex(userIndex);
            return masterSchemeExpenditures ;
        } catch (error) {
            return { success: false, message: 'Failed to fetch master scheme expenditures.', error };
        }
    }
}
