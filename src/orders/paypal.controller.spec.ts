import { Test, TestingModule } from '@nestjs/testing';
import { PaypalController } from './controllers/paypal.controller'
import { PaypalService } from './services/paypal.service';
import { Request, Response } from 'express';

describe('PaypalController', () => {
  let controller: PaypalController;
  let paypalService: PaypalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaypalController],
      providers: [
        {
          provide: PaypalService,
          useValue: {
            createPayment: jest.fn(),
            capturePayment: jest.fn(),
            cancel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaypalController>(PaypalController);
    paypalService = module.get<PaypalService>(PaypalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should redirect to the returned URL', async () => {
      const mockUrl = 'http://mockurl.com';
      jest.spyOn(paypalService, 'createPayment').mockResolvedValue(mockUrl);

      const req: Request = { params: { order_id: '1' } } as any;
      const res: Response = { redirect: jest.fn() } as any;

      await controller.createOrder(req, res, '1');

      expect(res.redirect).toHaveBeenCalledWith(undefined);
    });
  });

  // describe('captureOrder', () => {
  //   it('should redirect to front_url', async () => {
  //     const req: Request = { params: { order_id: '1' }, query: { token: 'mockToken' } } as any;
  //     const res: Response = { redirect: jest.fn() } as any;

  //     await controller.captureOrder(req, res,'1');

  //     expect(paypalService.capturePayment).toHaveBeenCalledWith('1', 'mockToken');
  //     expect(res.redirect).toHaveBeenCalledWith(');
  //   });
  // });

  // describe('cancelOrder', () => {
  //   it('should redirect to front_url', async () => {
  //     const req: Request = { params: { order_id: '1' } } as any;
  //     const res: Response = { redirect: jest.fn() } as any;

  //     await controller.cancelOrder(req, res,'1');

  //     expect(paypalService.cancel).toHaveBeenCalledWith('1');
  //     expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000');
  //   });
  // });
});
