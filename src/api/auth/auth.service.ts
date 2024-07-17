import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { master_users } from 'src/entity/user.entity';
import { LessThan, Repository } from 'typeorm';
import { emit } from 'process';
import axios from 'axios';

import * as os from 'os';
import * as bcrypt from 'bcrypt';
import { TokenDto, VerifyOtpdto, userLoginDto } from './dto/dto/create.auth.dto';
import {
  ForgetDto,
  ForgetpasswordResetDto,
  passwordcDto,
} from './dto/dto/forgot-password.dto';
import { masterdepartment } from 'src/entity/mastertable.enity';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Cron } from '@nestjs/schedule';
import { SendMessageDto } from './dto/dto/whatsapp.dto';
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'NODEAPI';
@Injectable()

export class AuthService {
  constructor(
    @InjectRepository(master_users) private user: Repository<master_users>,
    @InjectRepository(masterdepartment)
    private masterdepartment: Repository<masterdepartment>,
    private jwtService: JwtService,

 
  ) {}

  private readonly url = 'https://api.gupshup.io/wa/api/v1/template/msg';
  private readonly headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'apikey': 'psloncgl2r2h6xbjbgqsuqlrzcyllydc'
  };

 
  async login(data: userLoginDto) {
    try {
      const userId = data.userId.toLowerCase();
      const userDetails = await this.user.findOne({
        where: [{ userId: userId }],
      });

      if (!userDetails) {
        return {
          errorCode: 1,
          message: 'UserID Password is incorrect',
        };
      }

      // Check if the user is temporarily locked out
      const maxLoginAttempts = 3;
      const lockoutDuration = 60 * 1000; // 1 minute in milliseconds

      if (userDetails.loginAttempts >= maxLoginAttempts) {
        const lastLoginAttempt = userDetails.lastLoginAttempt.getTime();
        const now = new Date().getTime();
        const timeSinceLastAttempt = now - lastLoginAttempt;

        if (timeSinceLastAttempt < lockoutDuration) {
          const waitTimeSeconds = Math.ceil((lockoutDuration - timeSinceLastAttempt) / 1000);
          return {
            errorCode: 1,
            message: { errorCode: 1, mes: 'Too many requests for OTP resend from this IP, please try again later' },
          
          };
        } else {
          // Reset failed login attempts
          userDetails.loginAttempts = 0;
          await this.user.save(userDetails);
        }
      }

      // Check password
      const isMatch = await bcrypt.compare(data.password, userDetails.encryptpassword);

      if (isMatch) {
        // Reset failed login attempts on successful login
        userDetails.loginAttempts = 0;
        userDetails.lastLoginAttempt = null;
        await this.user.save(userDetails);

        // Generate OTP
        const otp = this.generateOTP();

        // Send OTP via SMS and/or other methods
        await this.sendSMS(userDetails.userName, userDetails.contactNo, otp);
        await this.sendMessage(userDetails.userName, userDetails.contactNo, otp);

        // Save OTP and timestamp to user record
        userDetails.otp = otp;
        userDetails.otpCreatedAt = new Date();
        await this.user.save(userDetails);

        // Generate JWT token
        const payload = { userId: userDetails.userId, otp: otp };
        const token = this.jwtService.sign(payload, { expiresIn: '100m' });

        return {
          errorCode: 0,
          message: 'Successfully logged in',
          token,
        };
      } else {
        // Increment failed login attempts
        userDetails.loginAttempts++;
        userDetails.lastLoginAttempt = new Date();
        await this.user.save(userDetails);

        // Check if user is now locked out
        if (userDetails.loginAttempts >= maxLoginAttempts) {
          return {
            errorCode: 1,
            message: `Too many failed attempts. Please wait 1 minute before trying again.`,
          };
        } else {
          return {
            errorCode: 1,
            message: 'Password is incorrect',
          };
        }
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Something went wrong');
    }
  }


  async sendSMSresetwp(userName: string, contactNo: string, otp: string): Promise<any> {
    const data = {
      channel: 'whatsapp',
      source: '916291265854',
      destination: contactNo,
      'src.name': 'dYI42JSUNDeli2TqB6moGbHY',
      template: JSON.stringify({
        id: '1ff43a39-649c-4fcc-ae9e-7d9008cf3e73',
        params: [userName, otp, 1]
      })
    };
  
    try {
      const response = await axios.post(this.url, new URLSearchParams(data).toString(), {
        headers: {
          ...this.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Error sending template message: ${error.response?.data || error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          `Unexpected error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  async sendMessage(userName: string, contactNo: string, otp: string): Promise<any> {
    const data = {
      channel: 'whatsapp',
      source: '916291265854',
      destination: contactNo,
      'src.name': 'dYI42JSUNDeli2TqB6moGbHY',
      template: JSON.stringify({
        id: '2943de2d-cdef-498b-923d-64dfc15d4826',
        params: [userName, otp, 1]
      })
    };
  


    try {
      const response = await axios.post(this.url, new URLSearchParams(data).toString(), {
        headers: {
          ...this.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `Error sending template message: ${error.response?.data || error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          `Unexpected error: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Cron('*/5 * * * * *') // Run every 5 seconds
  async handleCron() {


   // console.log('Checking for expired OTPs');

    const fortyFiveSecondsAgo = new Date(Date.now() - 60 * 1000);
    await this.user.update(
      { otpCreatedAt: LessThan(fortyFiveSecondsAgo) },
      { otp: null, otpCreatedAt: null },
    );

   // console.log('Expired OTPs invalidated');
  }
 async resendOtp(tokenDto: TokenDto) {
    try {
      const { token } = tokenDto;
    //  console.log(token)

      // Verify the token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });
      const { userId } = decoded;
      //console.log(decoded)
//console.log(userId)
      // Fetch the user details using the userId
      const userDetails = await this.user.findOne({
        where: [{ userId: userId }],
      });
//console.log(userDetails)
      if (!userDetails) {
        return {
          errorCode: 1,
          message: 'User not found',
        };
      }

      const otp = this.generateOTP();

      await this.sendSMS(userDetails.userName, userDetails.contactNo, otp);
      await this.sendMessage(userDetails.userName, userDetails.contactNo, otp);
      // Save OTP to user record in the database
      userDetails.otp = otp;
      await this.user.save(userDetails);

      return {
        errorCode: 0,
        message: 'OTP has been resent successfully',
      };
    } catch (error) {
      return {
        errorCode: 1,
        message: 'Invalid or expired token',
      };
    }
  }


  async sendSMS(
    userName: string,
    contactNo: string,
    otp: string,
  ): Promise<any> {
    try {
      const message = `Dear  ${userName}, OTP to login Karmashree Portal is ${otp} & valid for ${1} minutes. Don't share OTP - State Karmashree Team `;

      const response1 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: contactNo,
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response2 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: '8001073023',
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response3 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: '8335050997',
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response4 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
        "feedid": 392809,
        "username": 9831519878,
        "password": "Sub1kar#",
        "mobile": "8240341461",
        "messages": message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const response5 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: '8642945662',
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const response10 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
        "feedid": 392809,
        "username": 9831519878,
        "password": "Sub1kar#",
        "mobile": 8697748391,
        "messages": message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
     
      const response11 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
        "feedid": 392809,
        "username": 9831519878,
        "password": "Sub1kar#",
        "mobile": 8697748386,
        "messages": message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const response12 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
        "feedid": 392809,
        "username": 9831519878,
        "password": "Sub1kar#",
        "mobile": 8697748012,
        "messages": message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
     return [response1,response3, response2,response4, response5,response10,response11,response12];
    
    
   
     // return [response1];
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  // generateOTP() {
  //     const OTP_LENGTH = 6;
  //     let otp = '';

  //     // Generate a random number for each digit of the OTP
  //     for (let i = 0; i < OTP_LENGTH; i++) {
  //         otp += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
  //     }

  //     return otp;
  // }

  //   generateOTP() {
  //     return "6666";
  // }

  generateOTP() {
    // Generate a random 4-digit OTP
   // const otp = '6666';
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
  }
  async verifyOTP(data: VerifyOtpdto): Promise<any> {
    try {
      const userDetails = await this.user.findOne({
        where: { userId: data.userId },
      });

      if (!userDetails) {
        return {
          errorCode: 1,
          message: 'User not found',
        };
      }

      if (userDetails.otp !== data.otp) {
        return {
          errorCode: 1,
          message: 'Invalid OTP',
        };
      }

      const payload = {
        email: userDetails.email,
        category: userDetails.category,
        departmentNo: userDetails.departmentNo,

        deptWing: userDetails.deptWing,
        area: userDetails.area,
        districtcode: userDetails.districtcode,
        subDivision: userDetails.subDivision,
        blockCode: userDetails.blockCode,
        municipalityCode: userDetails.municipalityCode,
        gpCode: userDetails.gpCode,
        userIndex: userDetails.userIndex,
        dno_status: userDetails.dno_status,
        role_type: userDetails.role_type,
        officeNam_hd: userDetails.officeName_hd,
        officeNam_dept: userDetails.officeName_dept,
        officeNam_dist: userDetails.officeName_dist,
        officeNam_block: userDetails.officeName_block,
        officeNam_gp: userDetails.officeName_gp,
        userName: userDetails.userName,
        userId: userDetails.userId,
        designationID: userDetails.designationID,
        created_by: userDetails.created_by,
        currentStatus: userDetails.currentStatus,
        is_passwordreset: userDetails.is_passwordreset,
      };

      // Assuming process.env.SECRET is defined and valid
      const token = jwt.sign(payload, process.env.SECRET);
      const newPayload = {
        ...payload,
        token: token,
      };
      const response = {
        errorCode: 0,
        message: 'OTP verification successful',

        newPayload, // Including the payload in the response
      };

      return response;
    } catch (error) {
     // console.error(error);
      return {
        errorCode: 1,
        message: 'Something went wrong',
      };
    }
  }

  async getDepatmentbyid(departmentNo: number) {
    let dept;

    dept = await this.masterdepartment.findOne({
      where: { departmentNo },
      select: ['departmentName', 'departmentNo'],
    });

    return { errorCode: 0, result: dept };
  }
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });

      // Perform additional checks here
      if (!this.isValidPayload(payload)) {
        throw new Error('Invalid payload');
      }

      // Check if the token has expired
      if (this.isTokenExpired(payload.exp)) {
        throw new Error('Protocol has expired');
      }

      // Use the payload data here if needed
    //  console.log(payload);

      return {
        errorCode: 0,
        result: { ...payload, token },
      };
    } catch (error) {
      // Handle the error here
      console.error(error);

      return {
        errorCode: 1,
        message: error.message,
      };
    }
  }
  isValidPayload(payload) {
    // Add your specific payload validation logic here
    // For example:
    return !!payload && typeof payload === 'object' && !!payload.userId;
  }

  isTokenExpired(expirationTime) {
    // Check if the token has expired based on the expiration time
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  }
  // /////passwoed chnage
  // async passwordReset(data: passwordRestDto) {
  //   try {
  //     let user_data = await this.user.findOne({ where: { username: data.email } });

  //     if (user_data) {
  //       console.log("user details are found");
  //       console.log(user_data);

  //       const isMatch = await bcrypt.compare(
  //         data.current_password,
  //         user_data.password
  //       );

  //       if (isMatch) {
  //         const hash = await bcrypt.hash(data.new_password, 10);
  //         let password_updated = await this.user
  //           .createQueryBuilder()
  //           .update(User)
  //           .set({ password: hash })
  //           .where({ username: data.email }) //
  //           .execute();

  //         console.log(password_updated);

  //         let response = password_updated['affected'];
  //         console.log("response,response", response);

  //         if (response == 1) {
  //           return {
  //             errorCode: 0,
  //             message: "Password updated successfully",
  //           };
  //         }
  //       } else {
  //         return {
  //           errorCode: 1,
  //           message: "Your current password does not match",
  //         };
  //       }
  //     } else {
  //       return {
  //         errorCode: 1,
  //         message: "Your email is not found",
  //       };
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return {
  //       errorCode: 1,
  //       message: "Something went wrong",
  //       error: error.message,
  //     };
  //   }
  // }
  async passwordReset(data: ForgetpasswordResetDto) {
    try {
      const userDetails = await this.user.findOne({
        where: { userId: data.userId, contactNo: data.contactNo },
      });

      if (!userDetails) {
        return {
          errorCode: 1,
          message: 'UserID or contact number is incorrect',
        };
      }

     // console.log('Data:', data);
      //console.log('User Details:', userDetails);

      // Generate OTP
      const otp = this.generateOTP();

      await this.sendSMSresetwp(userDetails.userName, userDetails.contactNo, otp);
      // Save OTP to user record in the database
      userDetails.resetotp = otp;
      await this.user.save(userDetails);

      return {
        errorCode: 0,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        errorCode: 1,
        message: 'Something went wrong',
      };
    }
  }



  async sendSMSreset(userName: string, contactNo: string, otp: string) {
    try {
      const message = `Dear ${userName}, OTP to reset your password is ${otp} & valid for ${1} minutes. Don't share OTP - State Karmashree Team `;

      const response1 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: contactNo,
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response2 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: '8001073023',
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // const response3 = await axios.post(
      //   'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
      //   {
      //     feedid: 392809,
      //     username: 9831519878,
      //     password: 'Sub1kar#',
      //     mobile: '8335050997',
      //     messages: message,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );
      // const response4 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
      //   "feedid": 392809,
      //   "username": 9831519878,
      //   "password": "Sub1kar#",
      //   "mobile": "8240341461",
      //   "messages": message
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      const response5 = await axios.post(
        'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
        {
          feedid: 392809,
          username: 9831519878,
          password: 'Sub1kar#',
          mobile: '8642945662',
          messages: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return [response1, response2, response5];
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  async verifyResetOtp(data: ForgetDto) {
    try {
      const userDetails = await this.user.findOne({
        where: { userId: data.userId },
      });

      if (!userDetails || userDetails.resetotp !== data.resetotp) {
        return {
          errorCode: 1,
          message: ' OTP is incorrect',
        };
      }

      return {
        errorCode: 0,
        message: 'Reset OTP verification successful',
      };
    } catch (error) {
      console.error(error);
      return {
        errorCode: 1,
        message: 'Something went wrong',
      };
    }
  }

  async updateUser(userId: string, passwordDto: passwordcDto) {
    try {
      const userToUpdate = await this.user.findOne({
        where: { userId: userId },
      });

      if (!userToUpdate) {
        return { errorCode: 1, message: 'User not found' };
      }

      const hashedPassword = await bcrypt.hash(passwordDto.encryptpassword, 10);

      // Update the fields in userToUpdate object
      userToUpdate.encryptpassword = hashedPassword;
      userToUpdate.pwd = passwordDto.encryptpassword;
      // Assuming this is the correct field for encrypted password
      userToUpdate.is_passwordreset = '1'; // Assuming this is the correct field for indicating password reset
      // As
      const updatedUser = await this.user.save(userToUpdate);

      return { errorCode: 0, message: 'Password Change successful' };
    } catch (error) {
      return {
        errorCode: 1,
        message: 'Something went wrong',
        error: error.message,
      };
    }
  }
  async sendMediaMessage() {
    const data = JSON.stringify({
      userid: '2000239790',
      password: 'Zp7K!CZe',
      send_to: '8001073023',
      v: '1.1',
      format: 'json',
      msg_type: 'TEXT',
      method: 'SENDMESSAGE',
      msg: "Dear Hasan, OTP to login Karmashree Portal is 456321 & valid for 2 minutes. Don't share OTP&isTemplate=true&header=Karmashree Login OTP&footer=State Karmashree Team",
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://media.smsgupshup.com/GatewayAPI/rest',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  }
}
