import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsDate, IsArray } from 'class-validator';

export class WorkAllocationDto {
  @ApiProperty({ example: 'Scheme Area' })
  @IsNotEmpty()
  @IsString()
  schemeArea: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  departmentNo: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  districtcode: number;

  @ApiProperty({ example: 67890, nullable: true })
  @IsNumber()
  municipalityCode: number;

  @ApiProperty({ example: 123, nullable: true })
  @IsNumber()
  blockcode: number;

  @ApiProperty({ example: 456, nullable: true })
  @IsNumber()
  gpCode: number;

  @ApiProperty({ example: 'Scheme ID' })
  @IsNotEmpty()
  @IsString()
  schemeId: string;

  @ApiProperty({ example: '2024-05-14' })
  @IsNotEmpty()
 
  schemeName: string;

  @ApiProperty({ example: 'Contractor ID' })
  @IsNotEmpty()
  @IsString()
  contractorID: string;

  @ApiProperty({ example: 'Contractor ID' })
  @IsNotEmpty()
  @IsString()
  demanduniqueID:string;

  @ApiProperty({ example: 'Worker Job Card No' })
  @IsNotEmpty()
  @IsString()
  workerJobCardNo: string;

  @ApiProperty({ example: 'Worker Name' })
  @IsNotEmpty()
  @IsString()
  workerName: string;

  @ApiProperty({ example: '2024-05-14', type: Date })
  @IsNotEmpty()
  @IsDate()
  dateOfApplicationForWork: Date;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  noOfDaysWorkDemanded: number;

  @ApiProperty({ example: '2024-05-14', type: Date })
  @IsNotEmpty()
  @IsDate()
  workAllocationFromDate: Date;

  @ApiProperty({ example: '2024-05-20', type: Date })
  @IsNotEmpty()
  @IsDate()
  workAllocationToDate: Date;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsNumber()
  noOfDaysWorkAlloted: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  currentMonth: number;

  @ApiProperty({ example: 2024 })
  @IsNotEmpty()
  @IsNumber()
  currentYear: number;

  @ApiProperty({ example: '2023-2024' })
  @IsNotEmpty()
  @IsString()
  finYear: string;

  @ApiProperty({ example: 1 })
  userIndex: number;


  @ApiProperty({ example: 1 })
  requzitionuserIndex:number;


}

export class CreateWorkAllocationDto {
  @ApiProperty({
    type: [WorkAllocationDto],
    isArray: true,
    example: [{
      schemeArea: 'Rural',
      departmentNo: 1,
      districtcode: 12345,
      municipalityCode: 67890,
      blockcode: 123,
      gpCode: 456,
      schemeId: 'Scheme ID',
      demanduniqueID:'aas',
      schemeName: 'Scheme Name',
      contractorID: 'Contractor ID',
      workerJobCardNo: 'Worker Job Card No',
      workerName: 'Worker Name',
      dateOfApplicationForWork: '2024-05-14',
      noOfDaysWorkDemanded: 5,
      workAllocationFromDate: '2024-05-14',
      workAllocationToDate: '2024-05-20',
      noOfDaysWorkAlloted: 3,
      currentMonth: 5,
      currentYear: 2024,
      finYear: '2023-2024',
      userIndex: 1,
      requzitionuserIndex:1,
    }],
    required: true
  })
  workAllocations: WorkAllocationDto[];

  @ApiProperty({ example: 'yourReqId' })
  @IsString()
  @IsNotEmpty()
  reqId: string;

  @ApiProperty({ example: '2024-05-25T12:00:00.000Z', type: Date })
  
  @IsNotEmpty()
  reqDate: Date;
}