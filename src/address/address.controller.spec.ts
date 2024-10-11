import { Test, TestingModule } from '@nestjs/testing';

import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: AddressController;

  const mockAAddressService = {
    create: jest.fn(dto => {
      return {
        id: 'uuid',
        ...dto
      }
    }),
    update: jest.fn().mockImplementation((id, dto)=>{
      return {
        id: id,
        ...dto
      }
    }),
    findAll: jest.fn().mockImplementation(()=>[]),
    findOne: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        street: 'test'
      }
    }),
    remove: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        street: 'test',
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: {}, // Provide a mock implementation if needed
        },
        JwtService, Repository
      ],
    }).overrideProvider(AddressService)
      .useValue(mockAAddressService)
      .compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a Address', async () => {
    const addressDto = {street:'John Doe', avenue:'test', house_number:'', user_id:'', city_id:''}
    expect(controller.create(addressDto))
    .toEqual({
      id: 'uuid',
      ...addressDto
    })

    expect(mockAAddressService.create).toHaveBeenCalledWith(addressDto)
  })

  it('should update a Address', async () => {
    const addressDto = {street:'John Doe', house_number:'', user_id:'', city_id:''}
    
    expect(controller.update('1', addressDto))
    .toEqual({
      id: '1',
      ...addressDto
    })

    expect(mockAAddressService.update).toHaveBeenCalledWith('1', addressDto)

   
  })

  it('should return all users', async () => {
    expect(controller.findAll()).toEqual([])
    expect(mockAAddressService.findAll).toHaveBeenCalled()
  })

  it('should return a user', async () => {
    expect(await controller.findOne('1')).toEqual({
      id: '1',
      street: 'test',
    })
    expect(mockAAddressService.findOne).toHaveBeenCalledWith('1')
  })

  it('should delete a user', async () => {
    expect(controller.remove('1')).toEqual(
      undefined
    )
    expect(mockAAddressService.remove).toHaveBeenCalledWith('1')
  })

  

});
