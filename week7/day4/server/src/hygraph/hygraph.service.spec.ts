import { Test, TestingModule } from '@nestjs/testing';
import { HygraphService } from './hygraph.service';

describe('HygraphService', () => {
  let service: HygraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HygraphService],
    }).compile();

    service = module.get<HygraphService>(HygraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
