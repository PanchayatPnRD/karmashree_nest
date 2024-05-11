import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate, IsArray } from 'class-validator';

export class DemandMasterDto {


 

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  schemeArea: string;

@ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  departmentNo: number;

@ApiProperty({ example: '2' })
  @IsNotEmpty()
 
  districtcode: number;

@ApiProperty({ example: '2' })
  
 
  municipalityCode: number;

@ApiProperty({ example: '1' })

  blockcode: number;

@ApiProperty({ example: '1' })
 
  gpCode: number;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  workerJobCardNo: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  workerName: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  gender: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsOptional()
  @IsString()
  caste: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsOptional()
  @IsString()
  whetherMinority: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsOptional()
  @IsString()
  whetherMigrantWorker: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsOptional()
  @IsString()
  mobileNo: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsOptional()
  @IsString()
  aadhaarNo: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  typeOfWorkers: string;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsDate()
  dateOfApplicationForWork: Date;

@ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  noOfDaysWorkDemanded: number;

@ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  currentMonth: number;

@ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  currentYear: number;

@ApiProperty({ example: 'Nearest Landmark' })
  @IsNotEmpty()
  @IsString()
  finYear: string;



@ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userIndex: number;

}

export class CreateDemandMasterDto {
    @IsArray()
    @ApiProperty({
        type: DemandMasterDto,
        isArray: true,
        default: [
            {

                schemeArea: "Rural",

                departmentNo: 1,

                districtcode: 11,

                municipalityCode: 11,

                blockcode: 11,

                gpCode: 11111,

                workerJobCardNo: "9849219466214",

                workerName: "animesh",

                gender: "male",

                caste: "st",

                whetherMinority: "yes",

                whetherMigrantWorker: "yes",

                mobileNo: "8383838383",

                aadhaarNo: "223333",

                typeOfWorkers: "gdgdgdg",

                dateOfApplicationForWork: "12-02-2024",

                noOfDaysWorkDemanded: 7,

                currentMonth: 2,

                currentYear: 2224,

                finYear: 2024,

                userIndex: 1,
            }
        ]
    })
    DemandMasterDto: DemandMasterDto[];
}