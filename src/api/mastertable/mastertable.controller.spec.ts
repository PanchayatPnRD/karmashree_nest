import { Test, TestingModule } from '@nestjs/testing';
import { MastertableController } from './mastertable.controller';

describe('MastertableController', () => {
  let controller: MastertableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MastertableController],
    }).compile();

    controller = module.get<MastertableController>(MastertableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
