import { Test, TestingModule } from '@nestjs/testing';
import { VetdocController } from './vetdoc.controller';

describe('VetdocController', () => {
  let controller: VetdocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VetdocController],
    }).compile();

    controller = module.get<VetdocController>(VetdocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
