import { Test, TestingModule } from '@nestjs/testing';
import { AllocationController } from './allocation.controller';

describe('AllocationController', () => {
  let controller: AllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationController],
    }).compile();

    controller = module.get<AllocationController>(AllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
