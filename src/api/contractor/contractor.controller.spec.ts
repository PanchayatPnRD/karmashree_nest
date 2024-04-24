import { Test, TestingModule } from '@nestjs/testing';
import { ContractorController } from './contractor.controller';

describe('ContractorController', () => {
  let controller: ContractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractorController],
    }).compile();

    controller = module.get<ContractorController>(ContractorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
