import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class ForgetpasswordResetDto {
    
    
   
  
    @ApiProperty({ default: "ghjhj" })
    userId: string

    @ApiProperty({ default: "" })
    contactNo:string

   
    
    }

    export class ForgetDto {
    
    
        @IsNotEmpty()
   
        @ApiProperty({ default: "mri" })
        userId: string
    
        @ApiProperty({ default: "",required:true })
        resetotp:string
    
       
        
        }


     export class   passwordcDto{

        @IsNotEmpty()
        @ApiProperty({ default: "mri" })
        password: string
    
        @ApiProperty({ default: "",required:true })
        confirmpassword:string
    

     }