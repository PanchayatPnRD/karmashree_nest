import { IsNotEmpty,IsNumber,IsString,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class CreateActionPlanDto
    {
        

        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        departmentNo: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        schemeSector: number;
    
        @ApiProperty({ example: 'R' })
        @IsNotEmpty()
        schemeArea: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        districtCode: string;

        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        municipalityCode:string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        blockCode: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        gpCode: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        finYear: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        acMonth: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        acYear: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        tentativeCostOfScheme: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        totWagesPaid: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        totPersonDays: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        totJobCard: number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        averageDays: number;

            @ApiProperty({ example: '1' })
        @IsNotEmpty()
        ex1: string;
    
            @ApiProperty({ example: '1' })
        @IsNotEmpty()
        ex2: string;
    
           @ApiProperty({ example: '1' })
        @IsNotEmpty()
        ex3: string;
    
            @ApiProperty({ example: '1' })
        @IsNotEmpty()
        ex4: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        ex5: string;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        schemeProposed:number;
    
        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        userIndex: number;

        
    }