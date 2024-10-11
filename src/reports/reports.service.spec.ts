import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Status } from '../orders/entities/status.enum';
import { IncomeReportDto } from './dto/income_report.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockOrderRepository = () => ({
  find: jest.fn(),
  count: jest.fn(),
});

const mockOrderDetailRepository = () => ({
  find: jest.fn(),
});

const mockUserRepository = () => ({
  count: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReportService', () => {
  let service: ReportService;
  let orderRepository: MockRepository<Order>;
  let orderDetailRepository: MockRepository<OrderDetail>;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository() },
        { provide: getRepositoryToken(OrderDetail), useValue: mockOrderDetailRepository() },
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
        JwtService, ConfigService
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    orderRepository = module.get<MockRepository<Order>>(getRepositoryToken(Order));
    orderDetailRepository = module.get<MockRepository<OrderDetail>>(getRepositoryToken(OrderDetail));
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIncomeReport', () => {
    it('should return income report', async () => {
      const mockOrders = [
        {
          date: new Date(),
          status: Status.RECEIVED,
          order_details: [
            { quantity: 2, product: { price: 100, product_category: { category: 'Electronics' } } },
            { quantity: 1, product: { price: 200, product_category: { category: 'Books' } } },
          ],
        },
      ];

      orderRepository.find.mockResolvedValue(mockOrders);

      const report: IncomeReportDto = await service.getIncomeReport();

      expect(report.currentPeriod.income).toBe(400);
      expect(report.lastPeriod.income).toBe(400);
      //expect(report.incomeChange).toBeNaN();
      expect(report.ordersDays).toHaveLength(31);

    });
  });

  describe('getRegistrationStats', () => {
    it('should return registration stats', async () => {
      userRepository.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);

      const stats = await service.getRegistrationStats();

      expect(stats.totalRegistrations).toBe(10);
      expect(stats.percentageChange).toBe(100);
    });
  });

  describe('getOrderStats', () => {
    it('should return order stats', async () => {
      orderRepository.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5);

      const stats = await service.getOrderStats();

      expect(stats.totalOrders).toBe(10);
      expect(stats.ordersChange).toBe(100);
    });
  });
});
