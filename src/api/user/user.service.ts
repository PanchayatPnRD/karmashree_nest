import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_zp, masterdepartment, masterdesignation, user_role } from 'src/entity/mastertable.enity';
import { master_users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, SendSMSDto } from './dto/user.dto';
import * as bcrypt from "bcrypt";
import { Express } from 'express';
import { multerConfig } from 'src/commomn/middleware/multur.config';
import axios from 'axios';

import { UpdateUserDto } from './dto/useredit.dto';
import { CreateLibraryDto } from './dto/library.dto';
import { Libariry } from 'src/entity/library.entity';
import { Multer } from 'multer';
import { join, resolve, extname } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { UpdateLibraryDto } from './dto/UpdateLibraryDto.dto';
@Injectable()
export class UserService {


    constructor(
    
        @InjectRepository(master_users) private userRepository: Repository<master_users>,
        @InjectRepository(masterdepartment) private masterdepartmentREpo: Repository<masterdepartment>,
        @InjectRepository(user_role) private roleRepository: Repository<user_role>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(masterdesignation) private masterdesignation: Repository<masterdesignation>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(Libariry) private libraryRepository: Repository<Libariry>,

        

        
      ) {}

      async userCreate(data: CreateUserDto) {
        try {
          const department = await this.masterdepartmentREpo.findOne({ where: { departmentNo: data.departmentNo } });
        
     
  
          const existingUser = await this.userRepository.findOne({ where: [
            { contactNo: data.contactNo }
         
          ] });
          
          if (!existingUser) {
          
            const role_type = data.role_type;
      
       
            if (!role_type) {
              throw new BadRequestException('Role does not exist');
            }
            function generateRandomNumber() {
              // Generate a random number between 1000 and 9999 (4 digits)
              const randomNumber = Math.floor(Math.random() * 9000) + 1000;
              return randomNumber.toString(); // Convert to string
            }
           
            function generateRandomPassword() {
              const uppercaseChars = 'ABCDHIJKLMNPQRSTUVWXYZ';
              const lowercaseChars = 'abcdexyz';
              const specialChars = '@#';
              const numericChars = '123456789';
          
              // Create an array containing all possible characters
              const allChars = uppercaseChars + lowercaseChars + specialChars + numericChars;
          
              let password = '';
          
              // Add one uppercase letter
              password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
          
              // Add one lowercase letter
              password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
          
              // Add one special character
              password += specialChars[Math.floor(Math.random() * specialChars.length)];
          
              // Add one numeric character
              password += numericChars[Math.floor(Math.random() * numericChars.length)];
          
              // Add remaining characters randomly from allChars
              for (let i = 0; i < 4; i++) {
                  password += allChars[Math.floor(Math.random() * allChars.length)];
              }
          
              // Shuffle the password to randomize the order
              password = password.split('').sort(() => Math.random() - 0.5).join('');
          
              return password;
          }
          const password = generateRandomPassword();
      
          const hash = await bcrypt.hash(password, 10);

 
             
            
          const userId = generateUserId();
 

         
            function generateUserId() {
              let userIdPrefix = `KR`;

           

              if (data.category === 'HD') {
                
                  userIdPrefix += `${department.deptshort}`;

              } else if (data.category === 'DIST') {

                  if (data.dno_status === '1') {

                      userIdPrefix += `DNO${data.districtcode}`;
                  } else {
                      userIdPrefix += `${department.deptshort}${data.districtcode}`;
                  }
              } else if (data.category === 'SUB') {
                
                      userIdPrefix += `${department.deptshort}${data.districtcode}${data.subDivision}`;
                  
                 } else if (data.category === 'BLOCK') {
                  if (data.dno_status === '1') {
                      userIdPrefix += `BDO${data.districtcode}${data.blockCode}`;
                  } else {
                      userIdPrefix += `${department.deptshort}${data.districtcode}${data.blockCode}`;
                  }
              } else if (data.category === 'GP') {
                  if (data.dno_status === '1') {
                      userIdPrefix += `GP${data.gpCode}`;
                  } else {
                      userIdPrefix += `${department.deptshort}${data.gpCode}`;
                  }
              }
          
              return `${userIdPrefix}${generateRandomNumber()}`;
          }

       

       
          if (data.category === 'DIST') {
            if (data.dno_status === '1' && data.districtcode) {
                const existingDistrictUser = await this.userRepository.findOne({ where: { dno_status: '1', category: 'DIST', districtcode: data.districtcode } });
                if (existingDistrictUser) {
                    return { errorCode: 1, message: 'DNO user for district already exists' };
                }
            }
        }
        
          if (data.category === 'BLOCK') {
            // Check if DNO user for the block is already associated
            if (data.dno_status === '1' && data.districtcode && data.blockCode) {
                const existingBlockUser = await this.userRepository.findOne({ where: { dno_status: '1', category: 'BLOCK', districtcode: data.districtcode, blockCode: data.blockCode } });
                if (existingBlockUser) {
                    return { errorCode: 1, message: 'DNO user for block already exists in the same district' };
                }
            }
          }
          if (data.category === 'GP') {
            // Check if DNO user for the GP is already associated
            if (data.dno_status === '1' && data.districtcode && data.blockCode && data.gpCode) {
                const existingGPUser = await this.userRepository.findOne({ where: { dno_status: '1', category: 'GP', districtcode: data.districtcode, blockCode: data.blockCode, gpCode: data.gpCode } });
                if (existingGPUser) {
                    return { errorCode: 1, message: 'DNO user for GP already exists' };
                }
            }
          }
            const userData = {
              category: data.category,
              departmentNo: data.departmentNo,
              deptWing: data.deptWing,
              districtcode: data.districtcode,
              municipalityCode:data.municipalityCode,
              subDivision: data.subDivision,
              
              blockCode: data.blockCode,
              gpCode: data.gpCode,
              userType: data.userType,
              area:data.area,
              role_type: data.role_type,
              userId:userId,
              pwd: password,
              encryptpassword: hash,
              officeName_hd: data.officeName_hd,
              officeName_dept: data.officeName_dept,
              officeName_dist: data.officeName_dist,
              officeName_block: data.officeName_block,
              officeName_gp: data.officeName_gp,
              userName: data.userName,
              contactNo: data.contactNo,
              email: data.email,
              designationID: data.designationID,
              UserAddress: data.UserAddress,
              entryBy: data.entryBy,
              created_by: data.created_by,
              currentStatus: data.currentStatus,

              technical_officer: data.technical_officer,
              tech_designation_id: data.tech_designation_id,
              tech_mobile: data.tech_mobile,
              dno_status:data.dno_status,

              tech_email: data.tech_email,
              is_passwordreset:'1',



            };
      
            const savedUser = await this.userRepository.save(userData);
      //
            // Trigger sendSMS after saving the user
           await this.sendSMS(savedUser.userId, savedUser.contactNo, password);
      
            return { errorCode: 0,
              message: `You have successfully been registered in Karmashree portal, your user id is ${savedUser.userId} and details have been sent to your registered mobile number. Please change your password in first login`,
               result: savedUser.userId };
          } else {
            return { errorCode: 1, message: 'Mobile Number is already registered' };
          }
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }

 

      async sendSMS(userId: string, contactNo: string, password: string): Promise<any> {
        try {
          const message = `Congratulations! Your user ID in Karmashree portal is ${userId} and default password is ${password}. Please change your password in the first login - State Karmashree Team.`;
      
          const response1 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
      "feedid": 392809,
      "username": 9831519878,
      "password": "Sub1kar#",
      "mobile": contactNo,
      "messages": message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

   
    const response2 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
      "feedid": 392809,
      "username": 9831519878,
      "password": "Sub1kar#",
      "mobile": "8001073023", 
      "messages": message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response3 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
      "feedid": 392809,
      "username": 9831519878,
      "password": "Sub1kar#",
      "mobile": "8335050997", 
      "messages": message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
    const response5 = await axios.post('https://bulkpush.mytoday.com/BulkSms/JsonSingleApi', {
      "feedid": 392809,
      "username": 9831519878,
      "password": "Sub1kar#",
      "mobile": "8642945662", 
      "messages": message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return [response1, response2,response3,response5];
  } catch (error) {
   
    console.error("Error sending SMS:", error);
    throw error;
  }
}
      
      
async viewUserById(userIndex: number) {
  try {
      const user = await this.userRepository.findOne({ where: { userIndex } });

      if (!user) {
          return { errorCode: 1, message: 'User not found' };
      }

      const districtDetails = await this.getAllDistricts(user.districtcode);
      const districtName = districtDetails.result ? districtDetails.result.districtName : '';
      const subDetails = await this.getAllsub(user.subDivision);
      const subDivisionName = subDetails.result ? subDetails.result.subdivName : '';
      const blockDetails = await this.getAllblock(user.blockCode);
      const blockname = blockDetails.result ? blockDetails.result.blockName : '';
      const gpDetails = await this.getAllgp(user.gpCode);
      const gpName = gpDetails.result ? gpDetails.result.gpName : '';
      const deptDetails = await this.getDepatmentbyid(user.departmentNo);
      const deptName = deptDetails.result ? deptDetails.result.departmentName : '';

      const designationDetails = await this.getDesignationbyid(user.designationID);
      const designationName = designationDetails.result ? designationDetails.result.designation : '';
      const userDetails = {
        ...user,
        districtName: districtName,
        subDivisionName: subDivisionName,
        blockname: blockname,
        gpName: gpName,
        deptName:deptName,
        designationName:designationName
    };

    return {
        errorCode: 0,
        result: userDetails
    };

  } catch (error) {
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
  }
}


async updateUser(userIndex: number, updateUserDto: UpdateUserDto) {
  try {
    const userToUpdate = await this.userRepository.findOne({ where: { userIndex } });

    if (!userToUpdate) {
      return { errorCode: 1, message: 'User not found' };
    }

    if (updateUserDto.contactNo !== undefined) {
      // Check if the new contact number is already in use by another user
      const existingUser = await this.userRepository.findOne({ where: { contactNo: updateUserDto.contactNo } });
      if (existingUser && existingUser.userIndex !== userIndex) {
        return { errorCode: 1, message: 'Contact number is already in use by another user' };
      }
      userToUpdate.contactNo = updateUserDto.contactNo;
    }

    if (updateUserDto.deptWing !== undefined) {
      userToUpdate.deptWing = updateUserDto.deptWing;
    }
    if (updateUserDto.districtcode !== undefined) {
      userToUpdate.districtcode = updateUserDto.districtcode;
    }
    if (updateUserDto.municipalityCode !== undefined) {
      userToUpdate.municipalityCode = updateUserDto.municipalityCode;
    }
    if (updateUserDto.subDivision !== undefined) {
      userToUpdate.subDivision = updateUserDto.subDivision;
    }
    if (updateUserDto.blockCode !== undefined) {
      userToUpdate.blockCode = updateUserDto.blockCode;
    }
    if (updateUserDto.gpCode !== undefined) {
      userToUpdate.gpCode = updateUserDto.gpCode;
    }
    if (updateUserDto.area !== undefined) {
      userToUpdate.area = updateUserDto.area;
    }
    if (updateUserDto.officeName_hd !== undefined) {
      userToUpdate.officeName_hd = updateUserDto.officeName_hd;
    }
    if (updateUserDto.officeName_dept !== undefined) {
      userToUpdate.officeName_dept = updateUserDto.officeName_dept;
    }
    if (updateUserDto.officeName_dist !== undefined) {
      userToUpdate.officeName_dist = updateUserDto.officeName_dist;
    }
    if (updateUserDto.officeName_block !== undefined) {
      userToUpdate.officeName_block = updateUserDto.officeName_block;
    }
    if (updateUserDto.officeName_gp !== undefined) {
      userToUpdate.officeName_gp = updateUserDto.officeName_gp;
    }
    if (updateUserDto.userName !== undefined) {
      userToUpdate.userName = updateUserDto.userName;
    }
    if (updateUserDto.email !== undefined) {
      userToUpdate.email = updateUserDto.email;
    }
    if (updateUserDto.designationID !== undefined) {
      userToUpdate.designationID = updateUserDto.designationID;
    }
    if (updateUserDto.UserAddress !== undefined) {
      userToUpdate.UserAddress = updateUserDto.UserAddress;
    }
    if (updateUserDto.currentStatus !== undefined) {
      userToUpdate.currentStatus = updateUserDto.currentStatus;
    }
    if (updateUserDto.technical_officer !== undefined) {
      userToUpdate.technical_officer = updateUserDto.technical_officer;
    }
    if (updateUserDto.tech_designation_id !== undefined) {
      userToUpdate.tech_designation_id = updateUserDto.tech_designation_id;
    }
    if (updateUserDto.tech_mobile !== undefined) {
      userToUpdate.tech_mobile = updateUserDto.tech_mobile;
    }
    if (updateUserDto.tech_email !== undefined) {
      userToUpdate.tech_email = updateUserDto.tech_email;
    }
    if (updateUserDto.role_type !== undefined) {
      userToUpdate.role_type = updateUserDto.role_type;
    }

    const updatedUser = await this.userRepository.save(userToUpdate);

    return { errorCode: 0, result: updatedUser };
  } catch (error) {
    return { errorCode: 1, message: 'Something went wrong', error: error.message };
  }
}

      async getUserDetails(created_by: number) {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder('user');
    
            // Apply createdBy filtering if provided
            if (created_by !== undefined) {
              queryBuilder.andWhere('user.created_by = :created_by', { created_by });
          }
          
          // Use the andWhere method properly for dno_status
          queryBuilder.andWhere('user.dno_status = :dno_status', { dno_status: '0' });
          queryBuilder .orderBy('user.userIndex', 'DESC');
          // Get users
          const users = await queryBuilder.getMany();
    
            // Fetch districtName for each user
            const userDetails = await Promise.all(users.map(async (user) => {
              const districtDetails = await this.getAllDistricts(user.districtcode);
              const districtName = districtDetails.result ? districtDetails.result.districtName : '';
              const subDetails = await this.getAllsub(user.subDivision);
              const subDivisionName = subDetails.result ? subDetails.result.subdivName : '';
              const blockDetails = await this.getAllblock(user.blockCode);
              const blockname = blockDetails.result ? blockDetails.result.blockName : '';
              const gpDetails = await this.getAllgp(user.gpCode);
              const gpName = gpDetails.result ? gpDetails.result.gpName : '';
              const deptDetails = await this.getDepatmentbyid(user.departmentNo);
              const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
              const designationDetails = await this.getDesignationbyid(user.designationID);
              const designationName = designationDetails.result ? designationDetails.result.designation : '';
              return {
                  ...user,
                  districtName: districtName,
                  subDivisionName: subDivisionName,
                  blockname: blockname,
                  gpName: gpName,
                  deptName:deptName,
                  designationName:designationName

              };
            }));
    
            return {
                errorCode: 0,
                result: {
                    data: userDetails,
                },
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: 'Failed to retrieve user details: ' + error.message,
            };
        }
    }
    
     
    async getDnolist(created_by: number) {
      try {
          const queryBuilder = this.userRepository.createQueryBuilder('user');
  
          // Apply createdBy filtering if provided
          if (created_by !== undefined) {
            queryBuilder.andWhere('user.created_by = :created_by', { created_by });
        }
        
        // Use the andWhere method properly for dno_status
        queryBuilder.andWhere('user.dno_status = :dno_status', { dno_status: '1' });
        
        queryBuilder .orderBy('user.userIndex', 'DESC');
        // Get users
        const users = await queryBuilder.getMany();
  
          // Fetch districtName for each user
          const userDetails = await Promise.all(users.map(async (user) => {
              const districtDetails = await this.getAllDistricts(user.districtcode);
              const districtName = districtDetails.result ? districtDetails.result.districtName : '';
              const subDetails = await this.getAllsub(user.subDivision);
              const subDivisionName = subDetails.result ? subDetails.result.subdivName : '';
              const blockDetails = await this.getAllblock(user.blockCode);
              const blockname = blockDetails.result ? blockDetails.result.blockName : '';
              const gpDetails = await this.getAllgp(user.gpCode);
              const gpName = gpDetails.result ? gpDetails.result.gpName : '';
              const deptDetails = await this.getDepatmentbyid(user.departmentNo);
              const deptName = deptDetails.result ? deptDetails.result.departmentName : '';
              const designationDetails = await this.getDesignationbyid(user.designationID);
              const designationName = designationDetails.result ? designationDetails.result.designation : '';
              return {
                  ...user,
                  districtName: districtName,
                  subDivisionName: subDivisionName,
                  blockname: blockname,
                  gpName: gpName,
                  deptName:deptName,
                  designationName:designationName

              };
          }));
  
          return {
              errorCode: 0,
              result: {
                  data: userDetails,
              },
          };
      } catch (error) {
          return {
              errorCode: 1,
              message: 'Failed to retrieve user details: ' + error.message,
          };
      }
  }
    async getAllDistricts(districtCode: number) {
        try {
            let districtDetails;
    
            if (!districtCode || districtCode === 0) {
                // Handle the case when districtCode is empty or '0', if needed
                return { errorCode: 1, message: 'Invalid districtCode' };
            } else {
                districtDetails = await this.masterzp.findOne({ 
                    where: { districtCode }, 
                    select: ["districtName","districtCode"]
                });
            }

            return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong while retrieving district details: " + error.message
            };
        }
    }
    async getDepatmentbyid(departmentNo: number) {
      let dept; // Declare dept before the try block
    
   
          dept = await this.masterdepartmentREpo.findOne({ where: { departmentNo },  select: ["departmentName","departmentNo"] });
      
    
     
    
        return { errorCode: 0, result: dept };
  
       
      }
    
      async getDesignationbyid(designationId: number) {
        let dept; // Declare dept before the try block
      
     
            dept = await this.masterdesignation.findOne({ where: { designationId },  select: ["designationId","designation"] });
        
      
          if (!dept) {
            return { errorCode: 1, message: 'Department not found' };
          }
      
          return { errorCode: 0, result: dept };
       
        }
      
      
    
    async getAllsub(subdivCode: number) {
      try {
          let districtDetails;
  
          if (!subdivCode || subdivCode === 0) {
              // Handle the case when districtCode is empty or '0', if needed
              return { errorCode: 1, message: 'Invalid districtCode' };
          } else {
              districtDetails = await this.subdivision.findOne({ 
                  where: { subdivCode }, 
                  select: ["subdivName","subdivCode"]
              });
          }

          return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
      } catch (error) {
          return {
              errorCode: 1,
              message: "Something went wrong while retrieving district details: " + error.message
          };
      }
  }
  async getAllblock(blockCode: number) {
    try {
        let districtDetails;

        if (!blockCode || blockCode === 0) {
            // Handle the case when districtCode is empty or '0', if needed
            return { errorCode: 1, message: 'Invalid districtCode' };
        } else {
            districtDetails = await this.masterps.findOne({ 
                where: { blockCode }, 
                select: ["blockName","blockCode"]
            });
        }

        return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
    } catch (error) {
        return {
            errorCode: 1,
            message: "Something went wrong while retrieving district details: " + error.message
        };
    }
}

async getAllgp(gpCode: number) {
  try {
      let districtDetails;

      if (!gpCode || gpCode === 0) {
          // Handle the case when districtCode is empty or '0', if needed
          return { errorCode: 1, message: 'Invalid districtCode' };
      } else {
          districtDetails = await this.grampanchayat.findOne({ 
              where: { gpCode }, 
              select: ["gpName","gpCode"],
          });
      }

      return districtDetails ? { errorCode: 0, result: districtDetails } : { errorCode: 1, message: 'District not found' };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong while retrieving district details: " + error.message
      };
  }
}

async getUserSummaryByDepartment(departmentNo: number) {
  try {
    const queryBuilder = this.masterdepartmentREpo
      .createQueryBuilder('masterdepartment')
      .leftJoin('master_users', 'master_users', 'masterdepartment.departmentNo = master_users.departmentNo')
      .select([
        'masterdepartment.departmentNo',
        'masterdepartment.departmentName',
        'master_users.category',
        "COUNT(CASE WHEN master_users.role_type = '1' AND master_users.area = 'R' THEN 1 END) AS 'Admin User in Rural'",
        "COUNT(CASE WHEN master_users.role_type = '3' AND master_users.area = 'R' THEN 1 END) AS 'PIA in Rural'",
        "COUNT(CASE WHEN master_users.role_type = '2' AND master_users.area = 'R' THEN 1 END) AS 'Operater in Rural'",
        "COUNT(CASE WHEN master_users.role_type = '1' AND master_users.area = 'U' THEN 1 END) AS 'Admin User in Urban'",
        "COUNT(CASE WHEN master_users.role_type = '3' AND master_users.area = 'U' THEN 1 END) AS 'PIA in Urban'",
        "COUNT(CASE WHEN master_users.role_type = '2' AND master_users.area = 'U' THEN 1 END) AS 'Operater in Urban'",
        "COUNT(CASE WHEN master_users.role_type = '1' AND master_users.dno_status = '1' THEN 1 END) AS 'DNO'"
      ])
      .groupBy('masterdepartment.departmentNo, masterdepartment.departmentName, master_users.category')
      .orderBy('masterdepartment.departmentName', 'ASC');

    if (departmentNo) {
      queryBuilder.where('masterdepartment.departmentNo = :departmentNo', { departmentNo });
    }

    const result = await queryBuilder.getRawMany();
    return { errorCode: 0, result: result };
  } catch (error) {
    return { errorCode: 1, message: 'Something went wrong: ' + error.message };
  }
}
      
async create(createLibraryDto: CreateLibraryDto, file: Express.Multer.File) {
  try {
    let filename = null;
    let uploadPath = null;

    if (file && file.buffer) {
      // Generate a unique filename for the upload
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      filename = `${randomName}${extname(file.originalname)}`;

      const publicPdfDir = 'uploads';
      // Construct the full upload path
      uploadPath = join(publicPdfDir, filename);

      // Write the file to the specified destination
      await writeFile(uploadPath, file.buffer);
    }

    // Create a new Library entity with the provided data
    const library = this.libraryRepository.create({
      category: createLibraryDto.category,
      caption: createLibraryDto.caption,
      YoutubeLink: createLibraryDto.YoutubeLink,
      UploadFileLink: uploadPath, // Store the file path in the database
      status: createLibraryDto.status,
      pedastal: createLibraryDto.pedastal,
  
      userIndex: createLibraryDto.userIndex,
      originalFilename: file?.originalname || null,
      mimeType: file?.mimetype || null,
    });

    // Save the Library entity in the database
    await this.libraryRepository.save(library);

    // Return the saved library object
    return library;
  } catch (error) {
    // Handle any errors
    throw new Error(`Failed to create library entry: ${error.message}`);
  }
}

async update(id: number, updateLibraryDto: UpdateLibraryDto, file?: Express.Multer.File) {
  try {
    let uploadPath = null;

    if (file && file.buffer) {
      // Generate a unique filename for the upload
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const filename = `${randomName}_${file.originalname}`;

      // Construct the full upload path (adjust as per your folder structure)
      const uploadDir = 'uploads'; // Adjust the path as needed
      uploadPath = join(uploadDir, filename);

      // Write the file to the specified destination
      await writeFile(uploadPath, file.buffer);
    }

    // Find the library entry by ID
    const library = await this.libraryRepository.findOne({ where: { doc_id: id } });
    if (!library) {
      throw new Error(`Library entry with id ${id} not found`);
    }

    // Update the library entity with the provided data
    library.category = updateLibraryDto.category || library.category;
    library.caption = updateLibraryDto.caption || library.caption;
    library.YoutubeLink = updateLibraryDto.YoutubeLink || library.YoutubeLink;
    library.status = updateLibraryDto.status || library.status;
    library.pedastal = updateLibraryDto.pedastal || library.pedastal;
    library.userIndex = updateLibraryDto.userIndex || library.userIndex;
    library.UploadFileLink = uploadPath || library.UploadFileLink;
    library.originalFilename = file?.originalname || library.originalFilename;
    library.mimeType = file?.mimetype || library.mimeType;

    // Save the updated Library entity in the database
    await this.libraryRepository.save(library);

    // Return the updated library object
    return library;
  } catch (error) {
    // Handle any errors
    throw new Error(`Failed to update library entry: ${error.message}`);
  }
}
}
