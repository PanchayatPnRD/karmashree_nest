import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, SendSMSDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/useredit.dto';

@ApiTags("User")
@Controller('api/user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('create_user')
   async userCreate(@Body() createDto: CreateUserDto) {
     return await this.userService.userCreate(createDto);
   }
   @Get('viewuser/:userIndex') // This decorator defines a GET endpoint for retrieving a PCB by ID
   async viewPcbById(@Param('userIndex') userIndex: number) {
     return this.userService.viewUserById(userIndex); // Delegate retrieval to the service
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
}