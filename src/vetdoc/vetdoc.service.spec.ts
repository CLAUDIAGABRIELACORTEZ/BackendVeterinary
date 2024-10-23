import { Test, TestingModule } from '@nestjs/testing';
import { VetdocService } from './vetdoc.service';

describe('VetdocService', () => {
  let service: VetdocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VetdocService],
    }).compile();

    service = module.get<VetdocService>(VetdocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
