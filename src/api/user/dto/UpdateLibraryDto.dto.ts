import { ApiProperty, PartialType } from "@nestjs/swagger";


import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./user.dto";
import { CreateLibraryDto } from "./library.dto";



export class UpdateLibraryDto extends PartialType (CreateLibraryDto) {
}
