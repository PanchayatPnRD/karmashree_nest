import { Test, TestingModule } from '@nestjs/testing';
import { ContractorService } from './contractor.service';

describe('ContractorService', () => {
  let service: ContractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractorService],
    }).compile();

    service = module.get<ContractorService>(ContractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
