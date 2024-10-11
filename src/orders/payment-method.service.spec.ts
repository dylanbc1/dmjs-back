import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './services/payment_method.service';
import { PaymentMethod } from './entities/payment_method';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let repository: Repository<PaymentMethod>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentMethod),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repository = module.get<Repository<PaymentMethod>>(getRepositoryToken(PaymentMethod));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a payment method successfully', async () => {
      const createPaymentDto: CreatePaymentDto = {
        payment_name: 'Credit Card',
      };

      const paymentMethod = {
        id: '1',
        payment_name: 'Credit Card',
      } as PaymentMethod;

      jest.spyOn(repository, 'create').mockReturnValue(paymentMethod);
      jest.spyOn(repository, 'save').mockResolvedValue(paymentMethod);

      const result = await service.create(createPaymentDto);

      expect(result).toEqual(paymentMethod);
      expect(repository.create).toHaveBeenCalledWith(createPaymentDto);
      expect(repository.save).toHaveBeenCalledWith(paymentMethod);
    });
  });
});
