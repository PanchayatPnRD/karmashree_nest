import { Test, TestingModule } from '@nestjs/testing';
import { ActionplanController } from './actionplan.controller';

describe('ActionplanController', () => {
  let controller: ActionplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionplanController],
    }).compile();

    controller = module.get<ActionplanController>(ActionplanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
