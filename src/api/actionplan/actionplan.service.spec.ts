import { Test, TestingModule } from '@nestjs/testing';
import { ActionplanService } from './actionplan.service';

describe('ActionplanService', () => {
  let service: ActionplanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionplanService],
    }).compile();

    service = module.get<ActionplanService>(ActionplanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
