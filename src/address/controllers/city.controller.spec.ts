// city.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from '../services/city.service';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.find', async () => {
      await controller.findAll();
      expect(service.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
