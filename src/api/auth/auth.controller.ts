import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyOtpdto, userLoginDto } from './dto/dto/create.auth.dto';
import { Headers } from '@nestjs/common';
import { Verify } from 'crypto';
import { ForgetDto, ForgetpasswordResetDto, passwordcDto } from './dto/dto/forgot-password.dto';
import { ApiKeyGuard } from './api-key.guard';
@ApiTags("Authentication")



@Controller('api/auth')

export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @UseGuards(ApiKeyGuard)
    @ApiHeader({ name: 'x-api-key' })
    @Post('User_login')
    async login(@Body() userLoginDto: userLoginDto) {
      return await this.authService.login(userLoginDto);
    }
   
    @Get('getMe')
    @ApiHeader({
      name: 'token',
    })
    async verifyToken(@Headers('token') token: string) {
      const result = await this.authService.verifyToken(token);
      return result;
    }

    @UseGuards(ApiKeyGuard)
    @ApiHeader({ name: 'x-api-key' })
    @Post('verify-otp')
    async verifyOTP(@Body() data: VerifyOtpdto) {
    
      return    await this.authService.verifyOTP(data);
      
        }
        @UseGuards(ApiKeyGuard)
        @ApiHeader({ name: 'x-api-key' })
        @Post('passwordreset')
        async passwordReset(@Body() data: ForgetpasswordResetDto) {
          return    await this.authService.passwordReset(data);
            }
            @UseGuards(ApiKeyGuard)
            @ApiHeader({ name: 'x-api-key' })
            @Post('resetotp')
            async verifyResetOtp(@Body() data: ForgetDto) {
              return    await this.authService.verifyResetOtp(data);
                }
                @UseGuards(ApiKeyGuard)
                @ApiHeader({ name: 'x-api-key' })
                @Put('userId/:userId')
async updateUser(@Body() updateUserDto: passwordcDto, @Param('userId') userId: string) {
  return await this.authService.updateUser(userId, updateUserDto);
}

@UseGuards(ApiKeyGuard)
@ApiHeader({ name: 'x-api-key' })
@Post('send-media-message')
async sendMediaMessage() {
  const result = await this.authService.sendMediaMessage();

  return result;
}
}

