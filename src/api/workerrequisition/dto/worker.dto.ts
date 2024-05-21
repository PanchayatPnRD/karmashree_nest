import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional, IsArray } from 'class-validator';

export class MasterWorkerRequirementDto {




  @ApiProperty({ example: 'Scheme Area' })
  @IsNotEmpty()
  @IsString()
  schemeArea: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  departmentNo: number;

  @ApiProperty({ example: 'District Code' })
  @IsNotEmpty()
  
  districtcode: number;

  @ApiProperty({ example: 'Municipality Code', required: false })
  @IsOptional()

  municipalityCode: number;

  @ApiProperty({ example: 'Block Code', required: false })
  @IsOptional()

  blockcode: number;

  @ApiProperty({ example: 'GP Code', required: false })
  @IsOptional()

  gpCode: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sansadID: number;

  @ApiProperty({ example: 'Village Name' })
  @IsNotEmpty()
  @IsString()
  village: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  workCodeSchemeID: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  ContractorID: number;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  contactPersonName: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  contactPersonPhoneNumber: string;

  @ApiProperty({ example: 'Reporting Place' })
  @IsNotEmpty()
  @IsString()
  reportingPlace: string;

  @ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  nearestLandMark: string;

  @ApiProperty({ example: '2024-04-25' })
  @IsNotEmpty()
  @IsDate()
  fromDate: Date;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  noOfDays: number;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsNumber()
  currentMonth: number;

  @ApiProperty({ example: 2024 })
  @IsNotEmpty()
  @IsNumber()
  currentYear: number;

  @ApiProperty({ example: '2024-2025' })
  @IsNotEmpty()
  @IsString()
  finYear: string;

  @ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  FundingDeptname:string;



  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userIndex: number;

  @ApiProperty({
    isArray: true,
    default: [
      {

    skilledWorkers: 55,
  
   
    currentMonthWork: 766,
  
  
    currentYearWork: 66,
  
    
    finYearWork: 45,

        semiSkilledWorkers:77,
        unskilledWorkers: 77,

        dateofwork: "2023-06-22",
        
      }
    ]
  })
  @IsArray()
  createworkalloDto: CreateworkalloDto[];
  finYearWork: string;
  

    


  }
  export class CreateworkalloDto {
    @IsNotEmpty()
    @IsDate()
    @ApiProperty({ example: '2024-04-25' })
    dateofwork: Date;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 10, required: false })
    unskilledWorkers: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 5, required: false })
    semiSkilledWorkers: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 20, required: false })
    skilledWorkers: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 4 })
    currentMonthWork: number;
  
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 2024 })
    currentYearWork: number;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2024-2025' })
    finYearWork: string;
  }