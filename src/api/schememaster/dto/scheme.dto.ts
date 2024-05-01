import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class MasterSchemeDTO {
 

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    schemeId: number;

    @ApiProperty({ example: 'area' })
    @IsNotEmpty()
    @IsString()
    schemeArea: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    departmentNo: number;

    @ApiProperty({ example: 'district code' })
    @IsNotEmpty()
    @IsString()
    districtcode: string;

    @ApiProperty({ example: 'municipality code' })
    @IsNotEmpty()
    @IsString()
    municipalityCode: string;

    @ApiProperty({ example: 'block code' })
    @IsNotEmpty()
    @IsString()
    blockcode: string;

    @ApiProperty({ example: 'gp code' })
    @IsNotEmpty()
    @IsString()
    gpCode: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    sansadID: number;

    @ApiProperty({ example: 'village' })
    @IsNotEmpty()
    @IsString()
    village: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    schemeSector: number;

    @ApiProperty({ example: 'subsector' })
    @IsNotEmpty()
    @IsString()
    schemeSubsector: string;

    @ApiProperty({ example: 'scheme name' })
    @IsNotEmpty()
    @IsString()
    schemeName: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    FundingDepttID: number;

    @ApiProperty({ example: 'funding department name' })
    @IsNotEmpty()
    @IsString()
    FundingDeptname: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    ExecutingDepttID: number;

    @ApiProperty({ example: 'executing department name' })
    @IsNotEmpty()
    @IsString()
    ExecutingDeptName: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    ImplementingAgencyID: number;

    @ApiProperty({ example: 'implementing agency name' })
    @IsNotEmpty()
    @IsString()
    ImplementingAgencyName: string;

    @ApiProperty({ example: 'status of work' })
    @IsNotEmpty()
    @IsString()
    StatusOfWork: string;

    @ApiProperty({ example: '2024-05-01' })
    @IsDate()
    tentativeStartDate: Date;

    @ApiProperty({ example: '2024-05-01' })
    @IsDate()
    ActualtartDate: Date;

    @ApiProperty({ example: '2024-05-01' })
    @IsDate()
    ExpectedCompletionDate: Date;

    @ApiProperty({ example: 10000.50 })
    @IsNotEmpty()
    @IsNumber()
    totalprojectCost: number;

    @ApiProperty({ example: 5000.25 })
    @IsNotEmpty()
    @IsNumber()
    totalWageCost: number;

    @ApiProperty({ example: 100 })
    @IsNotEmpty()
    @IsNumber()
    totalLabour: number;

    @ApiProperty({ example: 1000 })
    @IsNotEmpty()
    @IsNumber()
    personDaysGenerated: number;

    @ApiProperty({ example: 500 })
    @IsNotEmpty()
    @IsNumber()
    totalUnskilledWorkers: number;

    @ApiProperty({ example: 200 })
    @IsNotEmpty()
    @IsNumber()
    totalSemiSkilledWorkers: number;

    @ApiProperty({ example: 100 })
    @IsNotEmpty()
    @IsNumber()
    totalSkilledWorkers: number;

    @ApiProperty({ example: 'work order number' })
    @IsNotEmpty()
    @IsString()
    workorderNo: string;

    @ApiProperty({ example: '2024-05-01' })
    @IsDate()
    workOderDate: Date;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    ControctorID: number;

    @ApiProperty({ example: 'A' })
    @IsNotEmpty()
    @IsString()
    schemeStatus: string;

    @ApiProperty({ example: 5 })
    @IsNotEmpty()
    @IsNumber()
    CurrentMonth: number;

    @ApiProperty({ example: 2024 })
    @IsNotEmpty()
    @IsNumber()
    CurrentYear: number;

    @ApiProperty({ example: '2023-2024' })
    @IsNotEmpty()
    @IsString()
    finYear: string;

    @ApiProperty({ example: 'remarks' })
    @IsNotEmpty()
    @IsString()
    Remarks: string;

    @ApiProperty({ example: 'ex1' })
    @IsNotEmpty()
    @IsString()
    ex1: string;

    @ApiProperty({ example: 'ex2' })
    @IsNotEmpty()
    @IsString()
    ex2: string;

    @ApiProperty({ example: 'ex3' })
    @IsNotEmpty()
    @IsString()
    ex3: string;

    @ApiProperty({ example: 'ex4' })
    @IsNotEmpty()
    @IsString()
    ex4: string;

    @ApiProperty({ example: 'ex5' })
    @IsNotEmpty()
    @IsString()
    ex5: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    userIndex: number;

  
}