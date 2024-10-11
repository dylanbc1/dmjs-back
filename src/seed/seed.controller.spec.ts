import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  let controller: SeedController;
  let service: SeedService;

  beforeEach(async () => {
    const mockSeedService = {
      seed: jest.fn().mockResolvedValue('seeder was success'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        {
          provide: SeedService,
          useValue: mockSeedService,
        },
      ],
    }).compile();

    controller = module.get<SeedController>(SeedController);
    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call seed service on create', async () => {
    const result = await controller.create({});
    expect(result).toBe('seeder was success');
    expect(service.seed).toHaveBeenCalled();
  });
});
