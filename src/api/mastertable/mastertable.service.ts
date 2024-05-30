import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_urban, master_zp, masterdepartment, masterdesignation, mastersector, pedestalMaster, user_role } from 'src/entity/mastertable.enity';
import { In, Repository } from 'typeorm';
import { DeptDto, DesignationDto, PedestalDto, RoleDto, SectorDto } from './dto/role.dto';
import { UpdateDto, UpdatePedestalDto } from './dto/updatemaster.dto';
import { jobcardformat } from 'src/entity/nrgsjobcardformat.entity';


@Injectable()
export class MastertableService {
    constructor(
        @InjectRepository(user_role) private userrole: Repository<user_role>,
        @InjectRepository(master_zp) private masterzp: Repository<master_zp>,
        @InjectRepository(master_subdivision) private subdivision: Repository<master_subdivision>,
        @InjectRepository(master_urban) private urban: Repository<master_urban>,
        @InjectRepository(pedestalMaster) private pedestalMaster: Repository<pedestalMaster>,
        @InjectRepository(jobcardformat) private jobcardformat: Repository<jobcardformat>,


        @InjectRepository(master_ps) private masterps: Repository<master_ps>,
        @InjectRepository(mastersector) private mastersector: Repository<mastersector>,
        @InjectRepository(masterdepartment) private masterdepartment: Repository<masterdepartment>,
        @InjectRepository(gram_panchayat) private grampanchayat: Repository<gram_panchayat>,
        @InjectRepository(masterdesignation) private masterdesignation: Repository<masterdesignation>,

      ) {}
    
      async createRole(data: RoleDto) {
        try {
          if (await this.userrole.findOne({ where: { role_type: data.name } }) == null) {
            const newRole = await this.userrole.create({
                role_type: data.name,
            });
            const result = await this.userrole.save(newRole);
            return {
              errorCode: 0,
              result: result,
            };
          } else {
            return {
              errorCode: 1,
              message: "newRole is already created",
            };
          }
        } catch (error) {
          return {
            errorCode: 1,
            message: "Something went wrong",
          };
        }
      }
    

      async getAllRoles() {
        try {
            const userrole = await this.userrole.find();
            return {
                errorCode: 0,
                result: userrole
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong"
            };
        }
    }
    async getAllDistrictsaction() {
        try {
            const dist = await this.masterzp.find({ select: ["districtName","districtCode"] });
            return {
                errorCode: 0,
                result: dist
            };
        } catch (error) {
            return {
                errorCode: 1,
                message: "Something went wrong"
            };
        }
    }

    async getAllDistricts(districtCode) {
      try {
        let dist;
        if (districtCode == 0 || districtCode == null) {
          dist = await this.masterzp.find(); // Retrieve all districts
        } else {
          // Retrieve a specific district based on districtCode
          dist = [await this.masterzp.findOne({ 
            where: { districtCode }, 
            select: ["districtName","districtCode"]
          })];
        
        }
    
        return {
          errorCode: 0,
          result: dist
        };
      } catch (error) {
        return {
          errorCode: 1,
          message: "Something went wrong"
        };
      }
    }
    

    
    // async getSubdivison(districtCode: string) {
    //     try {
    //       const subdiv = await this.subdivision.find({where:{districtCode},  select: ["subdivCode", "subdivName"] });
      
    //       if (!subdiv) {
    //         return { errorCode: 1, message: 'oparetor not found' };
    //       }
      
    //       return { errorCode: 0, result: subdiv };
    //     } catch (error) {
    //       return { errorCode: 1, message: 'Something went wrong', error: error.message };
    //     }
    //   }
      // async getSubdivison(districtCode: string) {
      //   try {
      //     let subdiv;
      //     if (districtCode == 0 || districtCode == null) {
      //       subdiv = await this.subdivision.find({ select: ["subdivCode", "subdivName"] });
      //     } else {
      //       subdiv = await this.subdivision.find({ where: { districtCode }, select: ["subdivCode", "subdivName"] });
      //     }
      
      //     if (!subdiv || subdiv.length === 0) {
      //       return { errorCode: 1, message: 'Subdivisions not found' };
      //     }
      
      //     return { errorCode: 0, result: subdiv };
      //   } catch (error) {
      //     return { errorCode: 1, message: 'Something went wrong', error: error.message };
      //   }
      // }
      

      async getSubdivison(districtCode: number, subdivCode?: number) {
        try {
            let subdiv;
    
            if (districtCode && (subdivCode == 0 || subdivCode == null)) {
                subdiv = await this.subdivision.find({ where: { districtCode }, select: ["subdivCode", "subdivName"] });
            } else if (subdivCode && subdivCode != 0) {
                subdiv = await this.subdivision.find({ where: { districtCode, subdivCode }, select: ["subdivCode", "subdivName"] });
            } else {
                return { errorCode: 1, message: 'Invalid parameters provided' };
            }
    
            if (!subdiv || subdiv.length === 0) {
                return { errorCode: 1, message: 'Subdivisions not found' };
            }
    
            return { errorCode: 0, result: subdiv };
        } catch (error) {
            return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
    }
    
    


      async getBlockaction(districtCode: number) {
        try {
          let blocks;
          if (districtCode == 0 || districtCode == null) {
            blocks = await this.masterps.find({ select: ["blockCode", "blockName"] });
          } else {
            blocks = await this.masterps.find({ where: { districtCode }, select: ["blockCode", "blockName"] });
          }
      
          if (!blocks || blocks.length === 0) {
            return { errorCode: 1, message: 'Blocks not found' };
          }
      
          return { errorCode: 0, result: blocks };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }
      

      async getBlock(districtCode: number, blockCode?: number) {
        try {
            let blocks;
    
            if (districtCode && (blockCode == 0 || blockCode == null)) {
                blocks = await this.masterps.find({ where: { districtCode }, select: ["blockCode", "blockName"] });
            } else if (blockCode && blockCode != 0) {
                blocks = await this.masterps.find({ where: { districtCode, blockCode }, select: ["blockCode", "blockName"] });
            } else {
                return { errorCode: 1, message: 'Invalid parameters provided' };
            }
    
            if (!blocks || blocks.length === 0) {
                return { errorCode: 1, message: 'Blocks not found' };
            }
    
            return { errorCode: 0, result: blocks };
        } catch (error) {
            return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
    }
    async getBlockbydistandsub(districtCode: number, subdivCode?: number) {
      try {
          let blocks;
  
          if (districtCode && (subdivCode == 0 || subdivCode == null)) {
              blocks = await this.masterps.find({ where: { districtCode }, select: ["blockCode", "blockName"] });
          } else if (subdivCode && subdivCode != 0) {
              blocks = await this.masterps.find({ where: { districtCode, subdivCode }, select: ["blockCode", "blockName"] });
          } else {
              return { errorCode: 1, message: 'Invalid parameters provided' };
          }
  
          if (!blocks || blocks.length === 0) {
              return { errorCode: 1, message: 'Blocks not found' };
          }
  
          return { errorCode: 0, result: blocks };
      } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
  }

      async getGpaction(districtCode: number, blockCode: number) {
        try {
          let gps;
          if ((districtCode == 0 || districtCode == null) && (blockCode == 0 || blockCode == null)) {
            gps = await this.grampanchayat.find({ select: ["gpCode", "gpName"] });
          } else {
            gps = await this.grampanchayat.find({ where: { districtCode, blockCode }, select: ["gpCode", "gpName"] });
          }
      
          if (!gps || gps.length === 0) {
            return { errorCode: 1, message: 'Gram Panchayats not found' };
          }
      
          return { errorCode: 0, result: gps };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }
      
      async getGp(districtCode: number, blockCode: number, gpCode?: number) {
        try {
            let gps;
    
            if (districtCode && (blockCode == 0 || blockCode == null) && (!gpCode || gpCode == 0)) {
                gps = await this.grampanchayat.find({ where: { districtCode }, select: ["gpCode", "gpName"] });
            } else if (blockCode && blockCode != 0 && (!gpCode || gpCode == 0)) {
                gps = await this.grampanchayat.find({ where: { districtCode, blockCode }, select: ["gpCode", "gpName"] });
            } else if (gpCode && gpCode != 0) {
                gps = await this.grampanchayat.find({ where: { districtCode, blockCode, gpCode }, select: ["gpCode", "gpName"] });
            } else {
                return { errorCode: 1, message: 'Invalid parameters provided' };
            }
    
            if (!gps || gps.length === 0) {
                return { errorCode: 1, message: 'Gram Panchayats not found' };
            }
    
            return { errorCode: 0, result: gps };
        } catch (error) {
            return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
    }

    async getonlyGp(gpCode: number) {
      try {
          let gps;
  
              gps = await this.grampanchayat.find({ where: { gpCode }, select: ["gpCode", "gpName"] });
         

          return { errorCode: 0, result: gps };
      } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
      }
  }


      async getDepatment() {
        try {
          const dept = await this.masterdepartment.find();
      
          if (!dept) {
            return { errorCode: 1, message: ' not found' };
          }
      
          return { errorCode: 0, result: dept };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }


      async getSector() {
        try {
          const sec = await this.mastersector.find();
      
          if (!sec) {
            return { errorCode: 1, message: ' not found' };
          }
      
          return { errorCode: 0, result: sec };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }

      async createSector(data: SectorDto) {
        try {
          const existingDesignation = await this.mastersector.findOne({ where: { sectorname: data.sectorname } });
          if (!existingDesignation) {
            const newDesignation = this.mastersector.create(data);
            const result = await this.mastersector.save(newDesignation);
            return {
              errorCode: 0,
              result: result,
            };
          } else {
            return {
              errorCode: 1,
              message: "Sector already exists",
            };
          }
        } catch (error) {
          return {
            errorCode: 1,
            message: "Something went wrong",
          };
        }
      }
      async getDepatmentbyid(departmentNo: number) {
        let dept; // Declare dept before the try block
      
        try {
          if (departmentNo == 0) {
            dept = await this.masterdepartment.find(); 
          } else {
            dept = [await this.masterdepartment.findOne({ where: { departmentNo } })];
          }
      
          if (!dept) {
            return { errorCode: 1, message: 'Department not found' };
          }
      
          return { errorCode: 0, result: dept };
        } catch (error) {
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }


        
      }
      
    //   async getdesignationbycatagory(designationLevel: string) {
    //     try {
    //         // Query the database to find a record with the provided designationLevel
    //         let dept = await this.masterdesignation.find({ where: { designationLevel } });
    
    //         // If no record is found, return an error response
    //         if (!dept) {
    //             return { errorCode: 1, message: 'Department not found' };
    //         }
    
    //         // If a record is found, return it along with success response
    //         return { errorCode: 0, result: dept };
    //     } catch (error) {
    //         // If an error occurs during the database operation, return an error response
    //         return { errorCode: 1, message: 'Something went wrong', error: error.message };
    //     }
    // }


          
  //   async getdesignationbycatagory() {
  //     try {
  //         // Query the database to find a record with the provided designationLevel
  //         let dept = await this.masterdesignation.find();
  
  //         // If no record is found, return an error response
  //         if (!dept) {
  //             return { errorCode: 1, message: 'Department not found' };
  //         }
  
  //         // If a record is found, return it along with success response
  //         return { errorCode: 0, result: dept };
  //     } catch (error) {
  //         // If an error occurs during the database operation, return an error response
  //         return { errorCode: 1, message: 'Something went wrong', error: error.message };
  //     }
  // }

          
  async getdesignationbycatagory(designationLevel:string) {
    try {
        // Query the database to find a record with the provided designationLevel
        let dept = await this.masterdesignation.find({where: {designationLevel:designationLevel}});

        // If no record is found, return an error response
        if (!dept) {
            return { errorCode: 1, message: 'Department not found' };
        }

        // If a record is found, return it along with success response
        return { errorCode: 0, result: dept };
    } catch (error) {
        // If an error occurs during the database operation, return an error response
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
}


async getdesignationfordnogp(designationIds: number[]) {
  try {
      // Query the database to find records with the provided designationIds
      let depts = await this.masterdesignation.find({ where: { designationId: In(designationIds) } });

      // If no records are found, return all departments
      if (!depts || depts.length == 0) {
          depts = await this.masterdesignation.find(); 
          return { errorCode: 0, result: depts };

      }

      // Map the departments to get department names and ids
      const departmentInfo = depts.map(dept => ({ designationId: dept.designationId, designation: dept.designation }));

      // Return the department names and ids along with success response
      return { errorCode: 0, result: departmentInfo };
  } catch (error) {
      // If an error occurs during the database operation, return an error response
      return { errorCode: 1, message: 'Something went wrong', error: error.message };
  }
}

    
  async createDesignation(data: DesignationDto) {
    try {
      const existingDesignation = await this.masterdesignation.findOne({ where: { designation: data.designation } });
      if (!existingDesignation) {
        const newDesignation = this.masterdesignation.create(data);
        const result = await this.masterdesignation.save(newDesignation);
        return {
          errorCode: 0,
          result: result,
        };
      } else {
        return {
          errorCode: 1,
          message: "Designation already exists",
        };
      }
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }

  async listDesignations() {
    try {
      const designations = await this.masterdesignation.find();
      return {
        errorCode: 0,
        result: designations,
      };
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }
    
  
  async updateDesignation(designationId: number, data: DesignationDto) {
    try {
      const designationToUpdate = await this.masterdesignation.findOne({ where: { designationId } });
      if (!designationToUpdate) {
        return {
          errorCode: 1,
          message: "Designation not found",
        };
      }

      // Update fields
    
      designationToUpdate.designationLevel = data.designationLevel;
      designationToUpdate.designation = data.designation;
      designationToUpdate.designationstage = data.designationstage;
      designationToUpdate.userType = data.userType;
      designationToUpdate.officeName = data.officeName;

      const updatedDesignation = await this.masterdesignation.save(designationToUpdate);
      return {
        errorCode: 0,
        result: updatedDesignation,
      };
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }


  async createDepartment(data: DeptDto) {
    try {
      const existingDesignation = await this.masterdepartment.findOne({ where: { departmentName: data.departmentName } });
      if (!existingDesignation) {
        const newDesignation = this.masterdepartment.create(data);
        const result = await this.masterdepartment.save(newDesignation);
        return {
          errorCode: 0,
          result: result,
        };
      } else {
        return {
          errorCode: 1,
          message: "Designation already exists",
        };
      }
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }

  async listDepatemt() {
    try {
      const designations = await this.masterdepartment.find();
      return {
        errorCode: 0,
        result: designations,
      };
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }
    
  
  async updateDept(departmentNo: number, data: UpdateDto) {
    try {
      const updateDept = await this.masterdepartment.findOne({ where: { departmentNo } });
      if (!updateDept) {
        return {
          errorCode: 1,
          message: "dept not found",
        };
      }

      // Update fields
    
      updateDept.departmentName = data.departmentName;
      updateDept.deptshort = data.deptshort;
      updateDept.labourConverge = data.labourConverge;
      updateDept.organization = data.organization;
     



      const updatedDept = await this.masterdepartment.save(updateDept);
      return {
        errorCode: 0,
        result: updatedDept,
      };
    } catch (error) {
      return {
        errorCode: 1,
        message: "Something went wrong",
      };
    }
  }

  async getMunicipality(districtCode: number, urbanCode?: number) {
    try {
        let urban;

        // Check if districtCode is provided
       
          if (districtCode && (urbanCode == 0 || urbanCode == null)) {
                urban = await this.urban.find({ where: { districtCode }, select: ["urbanCode", "urbanName"] });
            } else {
                urban = await this.urban.find({ where: { districtCode, urbanCode }, select: ["urbanCode", "urbanName"] });
            }
        
       
    
        return { errorCode: 0, result: urban };
    } catch (error) {
        return { errorCode: 1, message: 'Something went wrong', error: error.message };
    }
}


async getpdf(id:number) {
  try {
  
      return {
          errorCode: 0,
          result: 'https://www.irs.gov/pub/irs-pdf/f1040.pdf'
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong"
      };
  }
}

async createPedestal(data: PedestalDto) {
  try {
    if (await this.pedestalMaster.findOne({ where: { pedestalName: data.pedestalName } }) == null) {
      const newRole = await this.pedestalMaster.create({
        pedestalName: data.pedestalName,
        departmentName:data.departmentName,
        departmentNo:data.departmentNo,
        userIndex:data.userIndex
      });
      const result = await this.pedestalMaster.save(newRole);
      return {
        errorCode: 0,
        result: result,
      };
    } else {
      return {
        errorCode: 1,
        message: "newRole is already created",
      };
    }
  } catch (error) {
    return {
      errorCode: 1,
      message: "Something went wrong",
    };
  }
}


async getAllPedestal(departmentNo:string,id?:number) {
  try {
    let pedestalMaster;
      //const pedestalMaster = await this.pedestalMaster.find();
     // const pedestalMaster = await this.pedestalMaster.find({ where: { departmentNo }, select: ["id", "pedestalName"] });
      if (departmentNo && (id == 0 || id == null)) {
        pedestalMaster = await this.pedestalMaster.find({ where: { departmentNo }, select: ["id", "pedestalName"] });
    } else if (id && id != 0) {
      pedestalMaster = await this.pedestalMaster.find({ where: { departmentNo, id }, select: ["id", "pedestalName"] });
    } else {
        return { errorCode: 1, message: 'Invalid parameters provided' };
    }

    if (!pedestalMaster || pedestalMaster.length === 0) {
        return { errorCode: 1, message: 'Blocks not found' };
    }

    return { errorCode: 0, result: pedestalMaster };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong"
      };
  }
}

async PedestalList() {
  try {
      //const pedestalMaster = await this.pedestalMaster.find();
      const pedestalMaster = await this.pedestalMaster.find();
      return {
          errorCode: 0,
          result: pedestalMaster
      };
  } catch (error) {
      return {
          errorCode: 1,
          message: "Something went wrong"
      };
  }
}

async updatePedestal(id: number, data: UpdatePedestalDto) {
  try {
    const existingPedestal = await this.pedestalMaster.findOne({where:{id}});
    
    if (existingPedestal) {
      
      existingPedestal.departmentName = data.departmentName;
      existingPedestal.departmentNo = data.departmentNo;
      existingPedestal.pedestalName = data.pedestalName;
      existingPedestal.userIndex = data.userIndex;
      
      
      const updatedPedestal = await this.pedestalMaster.save(existingPedestal);
      
      return {
        errorCode: 0,
        result: updatedPedestal,
      };
    } else {
      return {
        errorCode: 1,
        message: "Pedestal not found",
      };
    }
  } catch (error) {
    return {
      errorCode: 1,
      message: "Something went wrong",
    };
  }
}


async getjobcard(gpCode: number) {
  try {
    let subdiv;

    subdiv = await this.jobcardformat.find({ where: { gpCode }, select: ["gpCode", "nregaPanchCode"] });

    // Add "WB-" to each nregaPanchCode
    subdiv = subdiv.map(item => ({ ...item, nregaPanchCode: `WB-${item.nregaPanchCode}` }));

    return { errorCode: 0, result: subdiv };
  } catch (error) {
    return { errorCode: 1, message: 'Something went wrong', error: error.message };
  }
}


}
