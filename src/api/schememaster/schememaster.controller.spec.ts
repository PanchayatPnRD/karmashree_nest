import { Test, TestingModule } from '@nestjs/testing';
import { SchememasterController } from './schememaster.controller';

describe('SchememasterController', () => {
  let controller: SchememasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchememasterController],
    }).compile();

    controller = module.get<SchememasterController>(SchememasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
