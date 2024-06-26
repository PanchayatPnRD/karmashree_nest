// create-library.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsInt, IsDateString } from 'class-validator';

export class CreateLibraryDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false  })
    @IsOptional()
    file: any; 
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    category: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    caption: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    YoutubeLink: string;
  
  
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    status: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    pedastal: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    orderno: string;
    
    @ApiProperty()
  
    orderDate: Date;
  
  
  
    // @ApiProperty()
    // @IsString()
    // @IsOptional()
    // ex1: string;
  
 
  
    @ApiProperty()
    @IsInt()
    userIndex: number;

 
}
