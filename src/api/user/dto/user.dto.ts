import { IsNotEmpty,IsNumber,IsString,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

    export class CreateUserDto
    {
        

        @IsNotEmpty()
        @ApiProperty({default:'HQ'})
        category: string;

        @IsNotEmpty()
        @ApiProperty({ default: 0 })
        departmentNo: number;

        @IsNotEmpty()
        @ApiProperty({default:''})
        deptWing: string;
      
        @IsNotEmpty()
        @ApiProperty({default:''})
        area:string
     
      
        @IsNotEmpty()
        @ApiProperty({ default: '0' })
        districtcode: number;
      
      
        @IsNotEmpty()
        @ApiProperty({ default: '0' })
        subDivision: number;
      
        @IsNotEmpty()
        @ApiProperty({ default: '0' })
        blockCode: number;

        @IsNotEmpty()
        @ApiProperty({ default: '0' })
        municipalityCode:number;
      
       
        @IsNotEmpty()
        @ApiProperty({ default: '0' })
        gpCode: number;

       
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
        @ApiProperty({default:'Karmashree Admin'})
        officeName_hd: string;

        @IsNotEmpty()
        @ApiProperty({default:'PnRD'})
        officeName_dept: string;

        @IsNotEmpty()
        @ApiProperty({default:''})
        officeName_dist: string;

        @IsNotEmpty()
        @ApiProperty({default:''})
        officeName_block: string;

        @IsNotEmpty()
        @ApiProperty({default:''})
        officeName_gp: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'Karmashre Test'})
        userName: string;

      
      
        @IsNotEmpty()
        @ApiProperty({default:'8796541236'})
        contactNo: string;

        @IsNotEmpty()
        @ApiProperty({default:'ugdsu@gmail.com'})
        email: string;
      
        @IsNotEmpty()
        @ApiProperty({default:'2'})
        designationID: number;
      
        @IsNotEmpty()
        @ApiProperty({default:'Kolkata'})
        UserAddress: string;


        @IsNotEmpty()
        @ApiProperty({default:''})
  technical_officer: string;

  @IsNotEmpty()
  @ApiProperty({default:''})
  tech_designation_id: string;

  @IsNotEmpty()
  @ApiProperty({default:''})
  tech_mobile: string;

  @IsNotEmpty()
  @ApiProperty({default:''})
  tech_email: string;


      
        @IsNotEmpty()
        @ApiProperty({default:'1'})
        entryBy: number;
      
        @IsNotEmpty()
        @ApiProperty({default:'1'})
        created_by: number;

        @IsNotEmpty()
        @ApiProperty({default:'0'})
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


     