import { Test, TestingModule } from '@nestjs/testing';
import { MastertableService } from './mastertable.service';

describe('MastertableService', () => {
  let service: MastertableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MastertableService],
    }).compile();

    service = module.get<MastertableService>(MastertableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
