import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsString, IsDate, IsNumber, IsPositive, Length, Matches, IsArray } from 'class-validator';

export class CreateEmploymentDto {
    @ApiProperty({
        description: 'System-generated unique employment ID',
        example: '1234567890'
    })
    @IsString()
    @Length(10, 10)
    employmentID: string; // Assuming you'll generate this value in your code

    @ApiProperty({
        description: 'Scheme area',
        example: 'A1'
    })
    @IsString()
  
    @IsNotEmpty()
    schemeArea: string;

    @ApiProperty({
        description: 'Department number',
        example: 1
    })
    @IsInt()
    @IsNotEmpty()
    departmentNo: number;

    @ApiProperty({
        description: 'District code',
        example: 101
    })
    @IsInt()
    @IsNotEmpty()
    districtcode: number;

    @ApiProperty({
        description: 'Municipality code',
        example: 102,
        required: false
    })
    @IsInt()
   
    municipalityCode: number;

    @ApiProperty({
        description: 'Block code',
        example: 103,
        required: false
    })
    @IsInt()
   
    blockcode: number;

    @ApiProperty({
        description: 'GP code',
        example: 104,
        required: false
    })
    @IsInt()
   
    gpCode: number;

    @ApiProperty({
        description: 'Scheme ID from Scheme Master',
        example: 105
    })
    @IsInt()
    @IsNotEmpty()
    schemeId: number;

    @ApiProperty({
        description: 'Scheme sector from Scheme Master',
        example: 106
    })
    @IsInt()
    @IsNotEmpty()
    schemeSector: number;

    @ApiProperty({
        description: 'Funding Department ID from Scheme Master',
        example: 107
    })
    @IsInt()
    @IsNotEmpty()
    FundingDepttID: number;

    @ApiProperty({
        description: 'Funding Department name from Scheme Master',
        example: 'Funding Department'
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    FundingDeptname: string;

    @ApiProperty({
        description: 'Executing Department ID from Scheme Master',
        example: 108
    })
    @IsInt()
    @IsNotEmpty()
    ExecutingDepttID: number;

    @ApiProperty({
        description: 'Executing Department name from Scheme Master',
        example: 'Executing Department'
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    ExecutingDeptName: string;

    @ApiProperty({
        description: 'Implementing Agency ID from Scheme Master',
        example: 109
    })
    @IsInt()
    @IsNotEmpty()
    ImplementingAgencyID: number;

    @ApiProperty({
        description: 'Implementing Agency name from Scheme Master',
        example: 'Implementing Agency'
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    ImplementingAgencyName: string;

    @ApiProperty({
        description: 'Work allocation ID from Allocation Master',
        example: 110
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    workAllocationID: string;

    @ApiProperty({
        description: 'Worker job card number from Allocation Master',
        example: 'Worker123'
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    workerJobCardNo: string;

    @ApiProperty({
        description: 'Worker name from Allocation Master',
        example: 'John Doe'
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    workerName: string;

    @ApiProperty({
        description: 'Work allocation from date from Allocation Master',
        example: '2023-05-01'
    })
    @IsDate()
    @IsNotEmpty()
    workAllocationFromDate: Date;

    @ApiProperty({
        description: 'Work allocation to date from Allocation Master',
        example: '2023-05-10'
    })
    @IsDate()
    @IsNotEmpty()
    workAllocationToDate: Date;

    @ApiProperty({
        description: 'Number of days work allotted from Allocation Master',
        example: 10
    })
    @IsInt()
    @IsNotEmpty()
    noOfDaysWorkAlloted: number;


    @ApiProperty({
        description: 'Number of days work allotted from Allocation Master',
        example: 10
    })
    @IsInt()
    @IsNotEmpty()
    noOfDaysWorProvided:number

    @ApiProperty({
        description: 'Total wage paid',
        example: 1500.50
    })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    totalWagePaid: number;

    @ApiProperty({
        description: 'Date of payment',
        example: '2023-05-15'
    })
    @IsDate()
    @IsNotEmpty()
    dateOfPayment: Date;

    @ApiProperty({
        description: 'Current month',
        example: 5
    })
    @IsInt()
    @IsNotEmpty()
    currentMonth: number;

    @ApiProperty({
        description: 'Current year',
        example: 2024
    })
    @IsInt()
    @IsNotEmpty()
    currentYear: number;


    @ApiProperty({
        description: 'Current year',
        example: 2024
    })
    @IsInt()
    @IsNotEmpty()
    totalUnskilledWorkers:number;

    @ApiProperty({
        description: 'Financial year',
        example: '2024-2025'
    })
    @IsString()
   
    @IsNotEmpty()
    finYear: string;

    

    @ApiProperty({
        description: 'User index from local storage/session data',
        example: 1
    })
  
    @IsNotEmpty()
    userIndex: number;

    

    @ApiProperty({
        description: 'Date of payment',
        example: '2023-05-15'
    })
    @IsDate()
    @IsNotEmpty()
    empProvidedfrom: Date;

    @ApiProperty({
        description: 'Date of payment',
        example: '2023-05-15'
    })
    @IsDate()
    @IsNotEmpty()
    empProvidedto: Date;

    @IsString()
   
    @IsNotEmpty()
    attandance:string;


    @ApiProperty({
        description: 'Date of payment',
        example: '2023-05-15'
    })
    @IsDate()
    @IsNotEmpty()
    dateOfApplicationForWork:Date;


    noOfDaysWorkDemanded:number;
   
   
    @IsNotEmpty()
    demandid:string;
}

export class EmploymentDto {
    @IsArray()
    @ApiProperty({
      type: CreateEmploymentDto,
      isArray: true,
      example: [
        {
       
          schemeArea: 'R' ,
          departmentNo: 2,
          districtcode:2,
          municipalityCode:2 ,
          blockcode: 2,
          gpCode:2 ,
          schemeId:2 ,
          schemeSector:2 ,
          FundingDepttID:2 ,
          FundingDeptname: "weudgywqb",
          ExecutingDepttID: 2,
          ExecutingDeptName:"uywgdyuqwg" ,
          ImplementingAgencyID: 2,
          ImplementingAgencyName:"weugduwd",
          workAllocationID: 1,
          workerJobCardNo: "556565565",
          workerName: "dhdhf",
          workAllocationFromDate: "2024-05-20",
          workAllocationToDate: "2024-05-20",
          noOfDaysWorkAlloted: 11,
          noOfDaysWorProvided:11,
          totalWagePaid: 11,
          dateOfPayment:  "2024-05-20",
          attandance:"as",
          noOfDaysWorkDemanded:1,
          dateOfApplicationForWork: "2024-05-20",
          
          empProvidedfrom:"2024-05-20",
          empProvidedto: "2024-05-20",
          demandid:"5",
          currentMonth: 5,
          currentYear: 2024,
          finYear: "2023-2024",
          userIndex: 5,
        }
      ]
    })
    CreateEmploymentDtos: CreateEmploymentDto[];
  }