import { ApiProperty, PartialType } from "@nestjs/swagger";


import { IsNotEmpty } from "class-validator";
import { CreateActionPlanDto } from "./actionplan.dto";




export class UpdateActionPlanDto extends PartialType (CreateActionPlanDto) {

}   
