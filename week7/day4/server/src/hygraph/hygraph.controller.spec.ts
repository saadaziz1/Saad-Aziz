import { Test, TestingModule } from '@nestjs/testing';
import { HygraphController } from './hygraph.controller';
import { HygraphService } from './hygraph.service';

describe('HygraphController', () => {
  let controller: HygraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HygraphController],
      providers: [HygraphService],
    }).compile();

    controller = module.get<HygraphController>(HygraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
