import { IsEmail, IsNotEmpty,IsString,Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({ example: '8001073023' })
    @IsString()
    @IsNotEmpty()
    sendTo: string;
  
    @ApiProperty({ example: 'Congratulations! Your user ID in Karmashree portal is 98999999 and default password is YTrMh#0. Please change your password in the first login.' })
    @IsString()
    @IsNotEmpty()
    msg: string;
  
    @ApiProperty({ example: 'Karmashree Login Information' })
    @IsString()
    @IsNotEmpty()
    header: string;
  
    @ApiProperty({ example: 'State Karmashree Team' })
    @IsString()
    @IsNotEmpty()
    footer: string;
  }