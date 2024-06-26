import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { master_users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { emit } from 'process';

import axios, { AxiosRequestConfig } from 'axios';
import * as os from 'os';
import * as bcrypt from 'bcrypt';
import { VerifyOtpdto, userLoginDto } from './dto/dto/create.auth.dto';
import {
  ForgetDto,
  ForgetpasswordResetDto,
  passwordcDto,
} from './dto/dto/forgot-password.dto';
import { masterdepartment } from 'src/entity/mastertable.enity';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
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

      if (userDetails) {
        console.log('Data:', data);
        console.log('User Details:', userDetails);

        const isMatch = await bcrypt.compare(
          data.password,
          userDetails.encryptpassword,
        );

        if (isMatch) {
          // Generate OTP}
          const otp = this.generateOTP();

          await this.sendSMS(userDetails.userName, userDetails.contactNo, otp);
          // Save OTP to user record in the database
          userDetails.otp = otp;
          await this.user.save(userDetails);
          return {
            errorCode: 0,
            message: 'Successfully logged in',
          };
        } else {
          return {
            errorCode: 1,
            message: 'Password is incorrect',
          };
        }
      } else {
        return {
          errorCode: 1,
          message: 'You are not authorized to login as an admin',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        errorCode: 1,
        message: 'Something went wrong',
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

      // const response2 = await axios.post(
      //   'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
      //   {
      //     feedid: 392809,
      //     username: 9831519878,
      //     password: 'Sub1kar#',
      //     mobile: '8001073023',
      //     messages: message,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

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
      // const response5 = await axios.post(
      //   'https://bulkpush.mytoday.com/BulkSms/JsonSingleApi',
      //   {
      //     feedid: 392809,
      //     username: 9831519878,
      //     password: 'Sub1kar#',
      //     mobile: '8642945662',
      //     messages: message,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

     // return [response1, response2, response5];
      return [response1];
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
    const otp = '6666';
    // const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
      console.error(error);
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
        throw new Error('Token has expired');
      }

      // Use the payload data here if needed
      console.log(payload);

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

      console.log('Data:', data);
      console.log('User Details:', userDetails);

      // Generate OTP
      const otp = this.generateOTP();

      await this.sendSMSreset(userDetails.userName, userDetails.contactNo, otp);
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
