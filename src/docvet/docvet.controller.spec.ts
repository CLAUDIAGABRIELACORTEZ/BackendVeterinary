import { Test, TestingModule } from '@nestjs/testing';
import { DocvetController } from './docvet.controller';

describe('DocvetController', () => {
  let controller: DocvetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocvetController],
    }).compile();

    controller = module.get<DocvetController>(DocvetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
