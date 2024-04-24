import {IsEmail, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotpasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({default:"ab@gmail.com"})
    email: string;
}

export class passwordRestDto {  

    @IsNotEmpty()
    @ApiProperty({ default: 'a@gmail.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ default: 'password@123' })
   current_password: string;

    @IsNotEmpty()
    @ApiProperty({ default: 'password@123' })
    new_password: string;
   

    }