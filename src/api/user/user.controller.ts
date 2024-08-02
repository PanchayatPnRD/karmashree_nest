import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors,Headers } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeader, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, SendSMSDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/useredit.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLibraryDto } from './dto/library.dto';
import { multerConfig } from 'src/commomn/middleware/multur.config';
import { UpdateLibraryDto } from './dto/UpdateLibraryDto.dto';
import { JwtService } from '@nestjs/jwt';
@ApiTags("User")
@ApiHeader({
  name: 'token',
})
@Controller('api/user')
export class UserController {

    constructor(private readonly userService: UserService,

      private readonly jwtService: JwtService
    ) {}

    @Post('create_user')
   async userCreate(@Body() createDto: CreateUserDto) {
     return await this.userService.userCreate(createDto);
   }


  //  @Get('viewuser/:userIndex') // This decorator defines a GET endpoint for retrieving a PCB by ID
  //  async viewPcbById(@Param('userIndex') userIndex: number) {
  //    return this.userService.viewUserById(userIndex); // Delegate retrieval to the service
  //  }
  @Get('viewuser')
  async viewUserByToken(@Headers() headers: Record<string, string>) {
    try {
      const token = headers['token'];
      if (!token) {
        throw new Error('Token not provided');
      }
      const decoded = this.jwtService.verify(token);
      return this.userService.viewUserById(decoded.userIndex);
    } catch (error) {
      return { error: error.message };
    }
  }

  
  //  @Post('sendsms')
  //  @ApiResponse({ status: 201, description: 'SMS sent successfully.' })
   
  //  async sendSMS(@Body() sendSMSDto: SendSMSDto): Promise<any> {
  //    try {
  //      const response = await this.userService.sendSMS(sendSMSDto);
  //      return response;
  //    } catch (error) {
  //      // Handle error appropriately, such as logging or returning a specific error response
  //      return { error: error.message };
  //    }
  //  }

   @Get('getUserList')

async getUserDetais(
  
   
    @Query('created_by') created_by: number,
  
) {
    return await this.userService.getUserDetails(created_by);
}
@Get('getDnolist')
async getDnolist( @Query('created_by') created_by: number,

) {
  return await this.userService.getDnolist(created_by);
}
@Put('updateUser/:userIndex')
async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('userIndex') userIndex: number) {
  return await this.userService.updateUser(userIndex, updateUserDto);
}

@Get('userslist-by-department')
async getUserSummaryByDepartment(@Query('departmentNo') departmentNo: number) {
  
  return await this.userService.getUserSummaryByDepartment(departmentNo);
}

@Get('User_list-by-category')

  async getUserListByCategory(
    @Query('category') category: string,
    @Query('dno_status') dno_status?: string,
    @Query('departmentNo') departmentNo?: number,
    @Query('districtCode') districtCode?: number,
    @Query('blockcode') blockcode?: number,
    @Query('subDivision') subDivision?: number,
    @Query('gpCode') gpCode?: number,
    @Query('deptWing') deptWing?: string,
    @Query('role') role?: number,
    @Query('userIndex') userIndex?: number,
  ) {
    try {
      const users = await this.userService.getuserlistbycatagory(
        category,
        dno_status,
        departmentNo,
        districtCode,
        blockcode,
        subDivision,
        gpCode,
        deptWing,
        role,
        userIndex,
      );
      return users
      
    } catch (error) {
      return {
        errorCode: 1,
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  @Get('DNO_list-by-category')
  async getdnouserlistbycatagory(
    @Query('category') category: string,
    @Query('dno_status') dno_status?: string,
    @Query('departmentNo') departmentNo?: number,
    @Query('districtCode') districtCode?: number,
    @Query('blockcode') blockcode?: number,
    @Query('subDivision') subDivision?: number,
    @Query('gpCode') gpCode?: number,
    @Query('deptWing') deptWing?: string,
    @Query('role') role?: number,
    @Query('userIndex') userIndex?: number,
  ) {
    try {
      const users = await this.userService.getdnouserlistbycatagory(
        category,
        dno_status,
        departmentNo,
        districtCode,
        blockcode,
        subDivision,
        gpCode,
        deptWing,
        role,
        userIndex,
      );
      return  users
     
    } catch (error) {
      return {
        errorCode: 1,
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }

  
@Post('createfileupload')
@UseInterceptors(FileInterceptor('file'))
@ApiConsumes('multipart/form-data')

async create(
  @Body() createLibraryDto: CreateLibraryDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.userService.create(createLibraryDto, file);
}

@Post('updatefileupload/:id')
@UseInterceptors(FileInterceptor('file')) // 'file' should match the field name in the form-data
@ApiConsumes('multipart/form-data')
@ApiParam({ name: 'id', type: Number })
@ApiBody({
  description: 'Update a library entry',
  type: UpdateLibraryDto,
})
async update(
  @Param('id') id: number,
  @Body() updateLibraryDto: UpdateLibraryDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.userService.update(id, updateLibraryDto, file);
}

@Get('list-by-category')
@ApiQuery({ name: 'category', required: false, type: String })

@ApiResponse({ status: 200, description: 'Filtered list of library entries by category' })
async listByCategory(@Query('category') category?: string) {
  return this.userService.listByCategory(category);
}
}