import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './services/reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

import { Review } from './entities/review.entity';
import { Product } from '../products/entities/products.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReviewRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({id: '1', ...user})),
    findOne: jest.fn().mockImplementation(id => {
      return {
        id: id,
        
      }
    }),
    find: jest.fn().mockImplementation(() => {
      return []
    }),
    remove: jest.fn().mockImplementation(id => {
        return{
          id: id,
          name: 'John Doe',
        }
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return {
        id: id,
        ...dto
      }
    }),
    preload: jest.fn().mockImplementation(user => Promise.resolve({ ...user }))
  }

  const mockProductRepository = {
    findOneBy: jest.fn().mockImplementation(id => {
        return {
            id: '1',
            name: 'John Doe',
            description: '123',
            price: 10,
            photo_url: '',
            product_category_id: ''
        }
    })
  }

  const mockUserRepository = {
    findOneBy: jest.fn().mockImplementation(id => {
        return {
            id: '1',
            name: 'John Doe',
            password: '123',
            email: '',
            photo_url: '',
            role_id: ''
        }
    })
  }
  

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
            provide: getRepositoryToken(Review),
            useValue: mockReviewRepository,
        },
        {
            provide: getRepositoryToken(Product),
            useValue: mockProductRepository,
        }
       
        
       
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a review', async () => {
    const reviewDto = {score: 10, user_id: '1', product_id: '1', comment: 'Great product'}
    expect(await service.create(reviewDto)).toEqual({
      ...reviewDto
    })
  })

  it('should create a review', async () => {
    const reviewDto = {score: 10, user_id: '1', product_id: '1', comment: 'Great product'}
    expect(await service.create(reviewDto)).toEqual({
      ...reviewDto
    })
   })


  it('should find a review by id', async () => {
    const reviewDto = {score: 10, user_id: '1', product_id: '1', comment: 'Great product'}
    expect(await service.findOne('1')).toEqual(
      {
        id:  {
         relations: [
           "product",
           "customer",
         ],
         where:  {
            id: "1",
         },
       },
       
      }
    );
  })

  it('should find all reviews', async () => {
    expect(await service.findAll()).toEqual([])
  })

  it('should remove a review', async () => {
    expect(await service.remove('1')).toEqual(undefined)
  })

  it('should update a review', async () => {
    const reviewDto = {score: 10, user_id: '1', product_id: '1', comment: 'Great product'}
    expect(await service.update('1', reviewDto)).toEqual({
      id: '1',
      ...reviewDto
    })
  })
 
});
