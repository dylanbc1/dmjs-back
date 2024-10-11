import { Test, TestingModule } from '@nestjs/testing';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Status } from './entities/status.enum';

describe('UsersController', () => {
  let controller: OrdersController;

  const mockOrderService = {
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
        status: Status.SENDED
      }
    }),
    remove: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        status: Status.SENDED
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {}, // Provide a mock implementation if needed
        },
        JwtService, Repository
      ],
    }).overrideProvider(OrdersService)
      .useValue(mockOrderService)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = {
      status: Status.SENDED,
      date: new Date('2024-06-16'),
      customer_id: '',
      seller_id: '',
      payment_method_id: '',
      address_id: '',
    }
    expect(controller.create(userDto))
    .toEqual({
      id: 'uuid',
      ...userDto
    })

    expect(mockOrderService.create).toHaveBeenCalledWith(userDto)
  })

  it('should update a user', async () => {
    const userDto = {status: Status.SENDED,
      date: new Date('2024-06-16'),
      customer_id: '',
      seller_id:'',
      payment_method_id: '',
      address_id: '',
    }
    
    expect(controller.update('1', userDto))
    .toEqual({
      id: '1',
      ...userDto
    })

    expect(mockOrderService.update).toHaveBeenCalledWith('1', userDto)

   
  })

  it('should return all users', async () => {
    // expect(controller.findAll()).toEqual([])
    // expect(mockOrderService.findAll).toHaveBeenCalled()
  })

  it('should return a user', async () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      status: Status.SENDED
    })
    expect(mockOrderService.findOne).toHaveBeenCalledWith('1')
  })

  it('should delete a user', async () => {
    expect(controller.remove('1')).toEqual({
      id: '1',
      status: Status.SENDED
    })
    expect(mockOrderService.remove).toHaveBeenCalledWith('1')
  })

  

});
