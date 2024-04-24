import { IsEmail, IsNotEmpty,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class userLoginDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ default: "p@gmail.com" })
    userId: string;



    @IsNotEmpty()
    @ApiProperty({default:"123"})
    password: string;


    }

    export class userLoginDto2 {

        @IsNotEmpty()
        @IsEmail()
        @ApiProperty({ default: "888" })
        contact_no: string;
    
        
    
        @IsNotEmpty()
        @ApiProperty({default:"123"})
        password: string;
      
      
      
    
        }

        export class VerifyOtpdto{

            
            @IsNotEmpty()
            @IsEmail()
            @ApiProperty({ default: "11" })
            userId: string;


                    @IsNotEmpty()
                    @ApiProperty({default:"123"})
                    otp: string;

        }

