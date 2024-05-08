import { Test, TestingModule } from '@nestjs/testing';
import { WorkerrequisitionController } from './workerrequisition.controller';

describe('WorkerrequisitionController', () => {
  let controller: WorkerrequisitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerrequisitionController],
    }).compile();

    controller = module.get<WorkerrequisitionController>(WorkerrequisitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
