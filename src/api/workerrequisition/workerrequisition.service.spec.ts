import { Test, TestingModule } from '@nestjs/testing';
import { WorkerrequisitionService } from './workerrequisition.service';

describe('WorkerrequisitionService', () => {
  let service: WorkerrequisitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkerrequisitionService],
    }).compile();

    service = module.get<WorkerrequisitionService>(WorkerrequisitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
