import { ApiProperty, PartialType } from "@nestjs/swagger";


import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./user.dto";



export class UpdateUserDto extends PartialType (CreateUserDto) {

}              