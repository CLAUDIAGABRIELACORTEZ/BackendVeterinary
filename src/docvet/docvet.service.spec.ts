import { Test, TestingModule } from '@nestjs/testing';
import { DocvetService } from './docvet.service';

describe('DocvetService', () => {
  let service: DocvetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocvetService],
    }).compile();

    service = module.get<DocvetService>(DocvetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
