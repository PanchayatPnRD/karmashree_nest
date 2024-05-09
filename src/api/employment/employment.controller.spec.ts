import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentController } from './employment.controller';

describe('EmploymentController', () => {
  let controller: EmploymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploymentController],
    }).compile();

    controller = module.get<EmploymentController>(EmploymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
