import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.enum';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
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
        name: 'John Doe',
      }
    }),
    remove: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        name: 'John Doe',
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {}, // Provide a mock implementation if needed
        },
        JwtService, Repository, ConfigService
      ],
    }).overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = {name: 'John Doe', password: '123', email: '', photo_url: '', role:Role.USER}
    expect(controller.create(userDto))
    .toEqual({
      id: 'uuid',
      ...userDto
    })

    expect(mockUserService.create).toHaveBeenCalledWith(userDto)
  })

  it('should update a user', async () => {
    const userDto = {name: 'John Doe', password: '123', email: '', photo_url: '', role: Role.USER}
    
    expect(controller.update('1', userDto))
    .toEqual({
      id: '1',
      ...userDto
    })

    expect(mockUserService.update).toHaveBeenCalledWith('1', userDto)

   
  })

  it('should return all users', async () => {
    // expect(controller.findAll()).toEqual([])
    // expect(mockUserService.findAll).toHaveBeenCalled()
  })

  it('should return a user', async () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      name: 'John Doe',
    })
    expect(mockUserService.findOne).toHaveBeenCalledWith('1')
  })

  it('should delete a user', async () => {
    expect(controller.remove('1')).toEqual({
      id: '1',
      name: 'John Doe',
    })
    expect(mockUserService.remove).toHaveBeenCalledWith('1')
  })

  

});
