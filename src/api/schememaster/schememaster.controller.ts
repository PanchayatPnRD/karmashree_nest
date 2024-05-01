import { Body, Controller, Post } from '@nestjs/common';
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
}
