import { ApiProperty, PartialType } from "@nestjs/swagger";


import { IsNotEmpty } from "class-validator";
import { MasterSchemeDTO } from "./scheme.dto";




export class UpdateMasterSchemeDTO extends PartialType (MasterSchemeDTO) {

} 