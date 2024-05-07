

import { ApiProperty, PartialType } from "@nestjs/swagger";


import { IsNotEmpty } from "class-validator";
import { DeptDto, PedestalDto } from "./role.dto";





export class UpdateDto extends PartialType (DeptDto) {

}  

export class UpdatePedestalDto extends PartialType(PedestalDto){

    
}