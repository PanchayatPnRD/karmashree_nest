import { Test, TestingModule } from '@nestjs/testing';
import { SchememasterService } from './schememaster.service';

describe('SchememasterService', () => {
  let service: SchememasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchememasterService],
    }).compile();

    service = module.get<SchememasterService>(SchememasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
