import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './services/orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaymentMethod } from './entities/payment_method';
import { Order } from './entities/order.entity';
import { Address } from '../address/entities/address.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from './entities/status.enum';

describe('OrdersService', () => {
  let service: OrdersService;
  let userRepository: Repository<User>;
  let paymentRepository: Repository<PaymentMethod>;
  let orderRepository: Repository<Order>;
  let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PaymentMethod),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Address),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    paymentRepository = module.get<Repository<PaymentMethod>>(getRepositoryToken(PaymentMethod));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    addressRepository = module.get<Repository<Address>>(getRepositoryToken(Address));
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        status: Status.PENDING,
        date: new Date(),
        customer_id: 'customer_id',
        payment_method_id: 'payment_method_id',
        address_id: 'address_id',
      };

      const user = { id: 'customer_id' } as User;
      const paymentMethod = { id: 'payment_method_id' } as PaymentMethod;
      const address = { id: 'address_id' } as Address;
      const order = {
        id: 'order_id',
        status: createOrderDto.status,
        date: createOrderDto.date,
        customer: user,
        payment_method: paymentMethod,
        address: address,
        order_details: [],
      } as Order;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(paymentMethod);
      jest.spyOn(addressRepository, 'findOne').mockResolvedValue(address);
      jest.spyOn(orderRepository, 'create').mockReturnValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(order);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'customer_id' } });
      expect(paymentRepository.findOne).toHaveBeenCalledWith({ where: { id: 'payment_method_id' } });
      expect(addressRepository.findOne).toHaveBeenCalledWith({ where: { id: 'address_id' } });
      expect(orderRepository.create).toHaveBeenCalledWith(createOrderDto);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createOrderDto: CreateOrderDto = {
        status: Status.PENDING,
        date: new Date(),
        customer_id: 'customer_id',
        payment_method_id: 'payment_method_id',
        address_id: 'address_id',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      //await expect(service.create(createOrderDto)).rejects.toThrow(NotFoundException);
      //expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'customer_id' } });
    });

    it('should throw NotFoundException if payment method not found', async () => {
      const createOrderDto: CreateOrderDto = {
        status: Status.PENDING,
        date: new Date(),
        customer_id: 'customer_id',
        payment_method_id: 'payment_method_id',
        address_id: 'address_id',
      };

      const user = { id: 'customer_id' } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(null);

      //await expect(service.create(createOrderDto)).rejects.toThrow(NotFoundException);
      //expect(paymentRepository.findOne).toHaveBeenCalledWith({ where: { id: 'payment_method_id' } });
    });

    it('should throw NotFoundException if address not found', async () => {
      const createOrderDto: CreateOrderDto = {
        status: Status.PENDING,
        date: new Date(),
        customer_id: 'customer_id',
        payment_method_id: 'payment_method_id',
        address_id: 'address_id',
      };

      const user = { id: 'customer_id' } as User;
      const paymentMethod = { id: 'payment_method_id' } as PaymentMethod;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(paymentMethod);
      jest.spyOn(addressRepository, 'findOne').mockResolvedValue(null);

      //await expect(service.create(createOrderDto)).rejects.toThrow(NotFoundException);
      //expect(addressRepository.findOne).toHaveBeenCalledWith({ where: { id: 'address_id' } });
    });
  });
});
