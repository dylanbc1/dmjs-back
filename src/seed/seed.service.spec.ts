import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Department } from '../address/entities/department.entity';
import { City } from '../address/entities/city.entity';
import { User } from '../users/entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { PaymentMethod } from '../orders/entities/payment_method';
import { Order } from '../orders/entities/order.entity';
import { ProductCategory } from '../products/entities/product-category.entity';
import { Product } from '../products/entities/products.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { Comment } from '../resources/entities/comment.entity';
import { Review } from '../resources/entities/review.entity';

describe('SeedService', () => {
  let service: SeedService;
  let mockDataSource: Partial<DataSource>;
  let mockQueryRunner: Partial<QueryRunner>;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run the seed without errors', async () => {
    await expect(service.seed()).resolves.toBe('seeder was success');
    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    //expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });
});
