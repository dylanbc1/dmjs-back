import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './reports.controller';
import { ReportService } from './reports.service';
import { IncomeReportDto } from './dto/income_report.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockReportService = () => ({
  getIncomeReport: jest.fn(),
  getRegistrationStats: jest.fn(),
  getOrderStats: jest.fn(),
});

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        { provide: ReportService, useValue: mockReportService() },JwtService, ConfigService
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIncomeReport', () => {
    it('should return income report', async () => {
      const mockReport: IncomeReportDto = {
        currentPeriod: { income: 400 },
        lastPeriod: { income: 200 },
        incomeChange: 1,
        ordersDays: [
          { date: '2024-06-01', income: 100 },
          { date: '2024-06-02', income: 300 },
        ]
      };

      jest.spyOn(service, 'getIncomeReport').mockResolvedValue(mockReport);

      const result = await controller.getIncomeReport();

      expect(result).toEqual(mockReport);
      expect(service.getIncomeReport).toHaveBeenCalled();
    });
  });

  describe('getRegistrationReport', () => {
    it('should return registration stats', async () => {
      const mockStats = {
        totalRegistrations: 10,
        percentageChange: 100,
      };

      jest.spyOn(service, 'getRegistrationStats').mockResolvedValue(mockStats);

      const result = await controller.getRegistrationReport();

      expect(result).toEqual(mockStats);
      expect(service.getRegistrationStats).toHaveBeenCalled();
    });
  });

  describe('getOrderStats', () => {
    it('should return order stats', async () => {
      const mockStats = {
        totalOrders: 10,
        ordersChange: 100,
      };

      jest.spyOn(service, 'getOrderStats').mockResolvedValue(mockStats);

      const result = await controller.getOrderStats();

      expect(result).toEqual(mockStats);
      expect(service.getOrderStats).toHaveBeenCalled();
    });
  });
});
