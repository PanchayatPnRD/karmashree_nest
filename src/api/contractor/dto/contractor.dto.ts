
import { IsEmpty, IsNotEmpty,IsNumber,IsString,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class CreateContractorDto
    {
         @ApiProperty({ example: 'abc' })
        @IsEmpty() 
        @IsString()
        contractorName: string;
    
         @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        @IsString()
        contractorGSTIN: string;


        @ApiProperty({ example: 'abc' })
        @IsEmpty() 
        @IsString()
        area:string;
    
         @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        @IsString()
        contractorPAN: string;
    
         @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        @IsString()
        contractorMobile: string;
    
         @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        @IsString()
        contractorAddress: string;
    
         @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        @IsString()
        contractorStatus: string;
    
         @ApiProperty({ example: '1' })
        @IsNotEmpty() 
        @IsNumber()
        userIndex: number;
    
         @ApiProperty({ example: '1' })
        @IsNotEmpty() 
        @IsNumber()
        c_month: number;
    
         @ApiProperty({ example: '' })
        @IsNotEmpty() 
        @IsNumber()
        c_Year: number;
    
         @ApiProperty({ example: '4' })
        @IsNotEmpty() 
        @IsString()
        finYear: string;
    
        @IsNumber()
         @ApiProperty({ example: '2' })
        @IsNotEmpty() 
        DepartmentNo: number;
    
         @ApiProperty({ example: '3' })
        @IsNotEmpty() 
      
        districtcode: number;
    
        @ApiProperty({ example: '1' })
       
        Municipality: number;
    
        @ApiProperty({ example: '1' })
    
        blockcode: number;
    
        @ApiProperty({ example: '1' })
  
        gpCode: number;

        contractor_uniqueNo:string
    
    
  
    }
              

    

   