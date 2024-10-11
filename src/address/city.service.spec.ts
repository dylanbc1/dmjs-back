import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './services/city.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<City>;

  const mockCityRepository = {
    find: jest.fn().mockImplementation(() => [
      {
        id: '1',
        name: 'Sample City',
        department: { id: '1', name: 'Sample Department' },
      },
    ]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      return id === '1'
        ? {
            id: '1',
            name: 'Sample City',
            department: { id: '1', name: 'Sample Department' },
          }
        : null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of cities', async () => {
      const result = await service.find();
      expect(result).toEqual([
        {
          id: '1',
          name: 'Sample City',
          department: { id: '1', name: 'Sample Department' },
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a city if found', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({
        id: '1',
        name: 'Sample City',
        department: { id: '1', name: 'Sample Department' },
      });
    });

    it('should return null if city not found', async () => {
      const result = await service.findOne('2');
      expect(result).toBeNull();
    });
  });
});
