import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './services/address.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { City } from './entities/city.entity';
import { User } from '../users/entities/user.entity';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<Address>;
  let userRepository: Repository<User>;
  let cityRepository: Repository<City>;

  const mockAddressRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(address => Promise.resolve({ id: '1', ...address })),
    findOne: jest.fn().mockImplementation(id => {
      return {
        id: '1',
        street: 'John Doe',
        house_number: '',
        user_id: '',
        city_id: ''
      }
    }),
    find: jest.fn().mockImplementation(() => {
      return []
    }),
    remove: jest.fn().mockImplementation(id => {
      return {
        id: id,
        street: 'John Doe',
      }
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id: id,
        ...dto
      }
    }),
    preload: jest.fn().mockImplementation(user => Promise.resolve({ ...user }))
  };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(id => {
      return {
        id: '1',
        street: 'John Doe',
        house_number: '',
        user_id: '',
        city_id: ''
      }
    })
  };

  const mockCityRepository = {
    findOne: jest.fn().mockImplementation(id => {
      return {
        id: '1',
        name: 'Sample City'
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        }
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<Repository<Address>>(getRepositoryToken(Address));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an address if found', async () => {
      const addressDto = { street: 'John Doe', house_number: '', user_id: '', city_id: '' };
      expect(await service.findOne('1')).toEqual(
        {
          id: '1',
          ...addressDto
        }
      );
    });
  });

  describe('create', () => {
    it('should create an address', async () => {
      const addressDto = { street: 'John Doe', avenue: '', house_number: '', user_id: '', city_id: '' };
      expect(await service.create(addressDto)).toEqual(
        expect.objectContaining(addressDto)
      );
    });
  });

  describe('findAll', () => {
    it('should return all addresses if found', async () => {
      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('update', () => {
    it('should return updated address if found', async () => {
      const addressDto = { street: 'John Doe', house_number: 'TestHouseNumber', user_id: '', city_id: '' };
      expect(await service.update('1', addressDto)).toEqual({
        id: '1',
        ...addressDto
      });
    });
  });

  describe('delete', () => {
    it('should remove an address', async () => {
      expect(await service.remove('1')).toBeUndefined();
    });
  });

  // Añadir más pruebas para otros métodos según sea necesario
});
