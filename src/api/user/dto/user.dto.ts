import { IsNotEmpty,IsNumber,IsString,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class CreateUserDto
    {
        

        @IsNotEmpty()
        @ApiProperty({default:'Admin'})
        category: string;

        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        departmentNo: number;

        @IsNotEmpty()
        @ApiProperty({default:'ABC'})
        deptWing: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'ABC'})
        area:string
     
      
        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        districtcode: string;
      
      
        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        subDivision: string;
      
        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        blockCode: string;

        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        municipalityCode:string;
      
       
        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        gpCode: string;

       
        @IsNotEmpty()
        
        @ApiProperty({ default: '1' })
        userType: number;
      
     
        @IsNotEmpty()
        @ApiProperty({ default: '1' })
        role_type: number;
        
        @IsNotEmpty()
        @ApiProperty({default:'dvadv'})
        userId: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'qwdqwd'})
        pwd: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'Aqwdqwdmin'})
        encryptpassword: string;

        @IsNotEmpty()
        @ApiProperty({default:'PWD'})
        officeName_hd: string;

        @IsNotEmpty()
        @ApiProperty({default:'PWD'})
        officeName_dept: string;

        @IsNotEmpty()
        @ApiProperty({default:'PWD'})
        officeName_dist: string;

        @IsNotEmpty()
        @ApiProperty({default:'PWD'})
        officeName_block: string;

        @IsNotEmpty()
        @ApiProperty({default:'PWD'})
        officeName_gp: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'ani'})
        userName: string;

      
      
        @IsNotEmpty()
        @ApiProperty({default:'2369723674'})
        contactNo: string;

        @IsNotEmpty()
        @ApiProperty({default:'ugdsu@gmail.com'})
        email: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'1'})
        designationID: number;
      
        @IsNotEmpty()
        @ApiProperty({default:'Kolkata'})
        UserAddress: string;


        @IsNotEmpty()
        @ApiProperty({default:'abc'})
  technical_officer: string;

  @IsNotEmpty()
  @ApiProperty({default:'1'})
  tech_designation_id: string;

  @IsNotEmpty()
  @ApiProperty({default:'75767'})
  tech_mobile: string;

  @IsNotEmpty()
  @ApiProperty({default:'wuvfgwv@gmail.com'})
  tech_email: string;


      
        @IsNotEmpty()
        @ApiProperty({default:'1'})
        entryBy: number;
      
        @IsNotEmpty()
        @ApiProperty({default:'1'})
        created_by: number;

        @IsNotEmpty()
        @ApiProperty({default:'1'})
        dno_status:string

        @IsNotEmpty()
        @ApiProperty({default:'A'})
        currentStatus: string;

        @ApiProperty({ example: '1' })
        @IsNotEmpty()
        is_passwordreset:string;

        
    }
    export class SendSMSDto {
        @ApiProperty({ example: 392809 })
        @IsNotEmpty()
     
        feedId: number;
      
        @ApiProperty({ example: 9831519878 })
        @IsNotEmpty()
       
        username: number;
      
        @ApiProperty({ example: 'Sub1kar#' })
        @IsNotEmpty()
       
        password: string;
      
        @ApiProperty({ example: 8001073023 })
        @IsNotEmpty()
     
        mobile: number;
      
        @ApiProperty({ example: 'Sir/Madam, please be kindly informed that, the meeting is scheduled to be held on 02-04-2024 Meeting No. 1247, organised by scjasjcas has been cancelled. -PRD Department' })
        @IsNotEmpty()
      
        messages: string;
        
      }


     