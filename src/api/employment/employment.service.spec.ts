import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentService } from './employment.service';

describe('EmploymentService', () => {
  let service: EmploymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentService],
    }).compile();

    service = module.get<EmploymentService>(EmploymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
