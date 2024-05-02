import { IsNotEmpty,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class RoleDto
    {
        @IsNotEmpty()
        @ApiProperty({default:'Admin'})
        name:string 

              mm

    }

    export class DesignationDto{

     


        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        designationLevel: string;


        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        designation: string;
      
        @ApiProperty({ example: 8001073023 })
        @IsNotEmpty()
        designationstage: number;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        userType: string;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        officeName: string;

      }

      export class DeptDto{


     
   
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        departmentName: string;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        labourConverge: string;

        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        deptshort:string;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        organization: string;
      }

      

      export class PedestalDto{

        @ApiProperty({ example: 1 })
        @IsNotEmpty()
        departmentNo: string;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        departmentName: string;
      
        @ApiProperty({ example: 'abc' })
        @IsNotEmpty() 
        pedestalName: string;

        @ApiProperty({ example: 1 })
        @IsNotEmpty()
        userIndex:number;
      }
 