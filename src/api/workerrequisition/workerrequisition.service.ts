import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterWorkerRequirement, MasterWorkerRequirement_allotment } from 'src/entity/workrequigition.entity';
import { Repository } from 'typeorm';
import { random } from 'lodash'; // Import the random function from lodash
import { MasterWorkerRequirementDto } from './dto/worker.dto';
@Injectable()
export class WorkerrequisitionService {
    constructor(
        @InjectRepository(MasterWorkerRequirement) private masterWorkerRequirement: Repository<MasterWorkerRequirement>,
        @InjectRepository(MasterWorkerRequirement_allotment) private masterWorkerRequirementallotment: Repository<MasterWorkerRequirement_allotment>,

        
    ) {}

    async create(createWorkerRequirementDto: MasterWorkerRequirementDto) {
        try {
          // Create a new MasterWorkerRequirement entity
          const masterWorker = this.masterWorkerRequirement.create(createWorkerRequirementDto);
      
          // Generate a random workerreqID
          const randomNum = this.generateRandomNumber();
          masterWorker.workerreqID = randomNum;
      
          // Save the MasterWorkerRequirement entity
          const savedMasterScheme = await this.masterWorkerRequirement.save(masterWorker);
      
          // Create an array to store MasterWorkerRequirement_allotment entities
          const masterAllotment: MasterWorkerRequirement_allotment[] = [];
      
          // Iterate through createworkalloDto array and create MasterWorkerRequirement_allotment entities
          for (const createWorkAllotDto of createWorkerRequirementDto.createworkalloDto) {
            const newMasterWorkerAllotment = this.masterWorkerRequirementallotment.create({
              workerreqID: masterWorker.workerreqID, // Use the same workerreqID as the parent entity
              skilledWorkers:createWorkAllotDto.skilledWorkers,
              unskilledWorkers:createWorkAllotDto.unskilledWorkers,
              semiSkilledWorkers:createWorkAllotDto.semiSkilledWorkers,
              currentMonthWork: createWorkAllotDto.currentMonthWork,
              currentYearWork: createWorkAllotDto.currentYearWork,
              finYearWork: createWorkAllotDto.finYearWork,
              dateofwork:createWorkAllotDto.dateofwork


            });
      
            // Save the MasterWorkerRequirement_allotment entity
            const createdMasterWorkerAllotment = await this.masterWorkerRequirementallotment.save(newMasterWorkerAllotment);
      
            // Push the saved entity to the masterAllotment array
            masterAllotment.push(createdMasterWorkerAllotment);
          }
      
          // Return success response with created MasterWorkerRequirement_allotment entities
          return { errorCode: 0, message: "Worker Requisition created successfully", masterAllotment };
        } catch (error) {
          // Return error response if any error occurs
          return { errorCode: 1, message: 'Something went wrong', error: error.message };
        }
      }
      
      private generateRandomNumber(): number {
        return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      }
    }