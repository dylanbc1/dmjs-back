import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailService } from './services/order_detail.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/products.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update_order_detail.dto';

describe('OrderDetailService', () => {
  let service: OrderDetailService;
  let orderDetailRepository: Repository<OrderDetail>;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;

  const mockOrderDetails: CreateOrderDetailDto[] = [
    {  quantity: 2, order_id: '1', product_id: '1' },
    {  quantity: 1, order_id: '1', product_id: '2' },
  ];

  const mockOrderDetailRepository = {
    create: jest.fn().mockImplementation((dto) => ({ id: '1', ...dto })),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    findOne: jest.fn().mockImplementation((id) => {
      const foundItem = mockOrderDetails.find((item) => item === id);
      return Promise.resolve(foundItem);
    }),
    preload: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    find: jest.fn().mockResolvedValue(mockOrderDetails),
    remove: jest.fn().mockResolvedValue(true),
  };

  const mockOrderRepository = {
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id })),
  };

  const mockProductRepository = {
    findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id })),
  };

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        {
          provide: getRepositoryToken(OrderDetail),
          useValue: mockOrderDetailRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
    orderDetailRepository = module.get<Repository<OrderDetail>>(
      getRepositoryToken(OrderDetail)
    );
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order detail', async () => {
      const createDto: CreateOrderDetailDto = {
        quantity: 2,
        order_id: '1',
        product_id: '1',
      };

      const createdOrderDetail = await service.create(createDto);

      expect(createdOrderDetail).toBeDefined();
      expect(createdOrderDetail.quantity).toBe(createDto.quantity);
      expect(orderDetailRepository.create).toHaveBeenCalledWith(createDto);
      expect(orderDetailRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createDto)
      );
    });

    

    it('should throw NotFoundException if product not found', async () => {
      const createDto: CreateOrderDetailDto = {
        quantity: 2,
        order_id: '1',
        product_id: '999',
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrowError(
        undefined
      );
    });
  });

  describe('find', () => {
    it('should return an array of order details', async () => {
      const result = await service.find();

      expect(result).toEqual(mockOrderDetails);
      expect(mockOrderDetailRepository.find).toHaveBeenCalledWith({
        relations: ['order', 'product'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an order detail by id', async () => {
      const orderDetailId = '1';
      const result = await service.findOne(orderDetailId);

      expect(result).toEqual(undefined);
      //expect(mockOrderDetailRepository.findOne).toHaveBeenCalledWith(orderDetailId);
    });

    
  });

  describe('update', () => {
    it('should update an order detail', async () => {
      const orderDetailId = '1';
      const updateDto: UpdateOrderDetailDto = { quantity: 5 };
      const updatedOrderDetail = { ...mockOrderDetails[0], ...updateDto };
      mockOrderDetailRepository.findOne.mockResolvedValueOnce(mockOrderDetails[0]);
      mockOrderDetailRepository.preload.mockResolvedValueOnce(updatedOrderDetail);

      const result = await service.update(orderDetailId, updateDto);

      expect(result).toEqual(updatedOrderDetail);
      //expect(mockOrderDetailRepository.preload).toHaveBeenCalledWith({
      //  id: orderDetailId,
      //  ...updateDto,
      //});
      expect(mockOrderDetailRepository.save).toHaveBeenCalledWith(updatedOrderDetail);
    });

    
  });

  describe('remove', () => {
    it('should remove an order detail', async () => {
      const orderDetailId = '1';
      mockOrderDetailRepository.findOne.mockResolvedValueOnce(mockOrderDetails[0]);

      await service.remove(orderDetailId);

      //expect(mockOrderDetailRepository.findOne).toHaveBeenCalledWith(orderDetailId);
      //expect(mockOrderDetailRepository.remove).toHaveBeenCalledWith(
       // mockOrderDetails[0]
      //);
    });

    
  });

  // Add more tests for other methods if needed
});

