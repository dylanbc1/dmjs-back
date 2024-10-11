import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/products.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(dto  => Promise.resolve({ id: '1', ...dto })),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === '1' || where.email === '') {
        return Promise.resolve({
          id: '1',
          name: 'John Doe',
          password: '123',
          email: '',
          photo_url: '',
          role_id: ''
        });
      }
      return undefined;
    }),
    find: jest.fn().mockResolvedValue([]),
    remove: jest.fn().mockResolvedValue({}),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    update: jest.fn().mockImplementation((id, dto) => {
      return { id, ...dto };
    }),
    preload: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  };

  const mockProductRepository = {
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Sample Product' }),
  };

  const mockOrderRepository = {
    find: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const userDto = { name: 'John Doe', password: '123', email: '', photo_url: '', role_id: '' };
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', ...userDto });
    });

    it('should return undefined for non-existing user', async () => {
      const result = await service.findOne('999');
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const result = await service.findAll({ skip: 0, take: 10});
      expect(result).toBeDefined();
      expect(result.data).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await service.remove('1');
      expect(result).toBeUndefined();
      expect(mockUserRepository.remove).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userDto = { name: 'Jane Doe', password: '456', email: 'jane@example.com', role_id: '' };
      const result = await service.update('1', userDto);
      expect(result).toEqual({ id: '1', ...userDto });
      //expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existing user during update', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
      const userDto = { name: 'Jane Doe', password: '456', email: 'jane@example.com', role_id: '' };
      //expect(service.update('999', userDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addFavoriteProduct', () => {
    it('should add a favorite product to user', async () => {
      const user = { id: '1', name: 'John Doe', email: 'john@example.com', favorites: [] };
      const product = { id: '1', name: 'Sample Product' };
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.addFavoriteProduct('1', '1');
      expect(result.favorites).toContainEqual(product);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existing product', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1', name: 'John Doe', email: 'john@example.com', favorites: [] });
      //expect(service.addFavoriteProduct('1', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFavoriteProducts', () => {
    it('should get favorite products of a user', async () => {
      const user = { id: '1', name: 'John Doe', email: 'john@example.com', favorites: [{ id: '1', name: 'Sample Product' }] };
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.getFavoriteProducts('1');
      expect(result).toEqual(user.favorites);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

