import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReviewsService = {
    create: jest.fn(dto => Promise.resolve({ id: '1', ...dto })),
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(id => Promise.resolve({ id, score: 5, comment: 'Great product!', product_id: '1', user_id: '1' })),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn(id => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a review', async () => {
    const reviewDto: CreateReviewDto = {
      score: 5,
      comment: 'Great product!',
      user_id: '1',
      product_id: '1',
    };

    expect(await controller.create(reviewDto)).toEqual({
      id: '1',
      ...reviewDto,
    });

    expect(mockReviewsService.create).toHaveBeenCalledWith(reviewDto);
  });

  it('should find all reviews', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(mockReviewsService.findAll).toHaveBeenCalled();
  });

  it('should find a review by id', async () => {
    const reviewDto = {
      id: '1',
      score: 5,
      comment: 'Great product!',
      product_id: '1',
      user_id: '1',
    };

    expect(await controller.findOne('1')).toEqual(reviewDto);
    expect(mockReviewsService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a review', async () => {
    const updateReviewDto: UpdateReviewDto = {
      score: 4,
      comment: 'Good product!',
    };

    expect(await controller.update('1', updateReviewDto)).toEqual({
      id: '1',
      ...updateReviewDto,
    });

    expect(mockReviewsService.update).toHaveBeenCalledWith('1', updateReviewDto);
  });

  it('should remove a review', async () => {
    expect(await controller.remove('1')).toEqual(undefined);
    expect(mockReviewsService.remove).toHaveBeenCalledWith('1');
  });
});
