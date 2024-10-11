import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './services/department.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let repository: Repository<Department>;

  const mockDepartmentRepository = {
    find: jest.fn().mockImplementation(() => [
      {
        id: '1',
        name: 'Sample Department',
        cities: [{ id: '1', name: 'Sample City' }],
      },
    ]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      return id === '1'
        ? {
            id: '1',
            name: 'Sample Department',
            cities: [{ id: '1', name: 'Sample City' }],
          }
        : null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockDepartmentRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    repository = module.get<Repository<Department>>(getRepositoryToken(Department));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of departments', async () => {
      const result = await service.find();
      expect(result).toEqual([
        {
          id: '1',
          name: 'Sample Department',
          cities: [{ id: '1', name: 'Sample City' }],
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a department if found', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({
        id: '1',
        name: 'Sample Department',
        cities: [{ id: '1', name: 'Sample City' }],
      });
    });

    it('should return null if department not found', async () => {
      const result = await service.findOne('2');
      expect(result).toBeNull();
    });
  });
});
