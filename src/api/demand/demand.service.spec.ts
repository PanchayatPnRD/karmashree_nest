import { Test, TestingModule } from '@nestjs/testing';
import { DemandService } from './demand.service';

describe('DemandService', () => {
  let service: DemandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandService],
    }).compile();

    service = module.get<DemandService>(DemandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
