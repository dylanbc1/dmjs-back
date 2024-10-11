import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from './order_details.controller';
import { OrderDetailService } from '../services/order_detail.service';
import { CreateOrderDetailDto } from '../dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from '../dto/update_order_detail.dto';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;
  let service: OrderDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [
        {
          provide: OrderDetailService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
    service = module.get<OrderDetailService>(OrderDetailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto: CreateOrderDetailDto = {
        quantity: 1,
        order_id: 'order1',
        product_id: 'product1',
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
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

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = '1';
      const dto: UpdateOrderDetailDto = {
        quantity: 2,
        order_id: 'order1',
        product_id: 'product1',
      };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const id = '1';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
