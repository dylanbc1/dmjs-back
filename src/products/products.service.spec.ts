import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Product } from './entities/products.entity';
import { ProductCategory } from './entities/product-category.entity';
import { User } from '../users/entities/user.entity';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { Review } from '../resources/entities/review.entity';
import { PageMetaDto } from '../pagination/page-meta.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepository = {
    create: jest.fn().mockImplementation(product => Promise.resolve({ id: '1', ...product })),
    save: jest.fn().mockImplementation(product => Promise.resolve({ id: '1', ...product })),
    findOne: jest.fn().mockImplementation(id => Promise.resolve({
      id: '1',
      product_name: 'John Doe',
      description: '123',
      price: 10,
      photo_url: '',
      quantity: 3,
      product_category_id: '2',
      seller_id: '3',
      reviews: [{ score: 5 }, { score: 3 }] // Simulando algunas reseñas
    })),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
    remove: jest.fn().mockImplementation(id => Promise.resolve({
      id: id,
      name: 'John Doe',
    })),
    update: jest.fn().mockImplementation((id, dto) => Promise.resolve({
      id: id,
      ...dto
    })),
    preload: jest.fn().mockImplementation(user => Promise.resolve({ ...user })),
    findAndCount: jest.fn().mockImplementation(() => Promise.resolve([[], 0])), // Simulando `findAndCount`
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    }), // Simulando `createQueryBuilder`
  };

  const mockProductCategoryRepository = {
    findOne: jest.fn().mockImplementation(id => Promise.resolve({ id: id }))
  };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(id => Promise.resolve({ id: id }))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockProductCategoryRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product record and return that', async () => {
    const productDto = {
      product_name: 'John Doe',
      description: '123',
      price: 10,
      photo_url: [''],
      product_category_id: '2',
      quantity: 3,
      seller_id: '3'
    };
    expect(await service.create(productDto))
      .toEqual({
        id: '1',
        ...productDto
      });

    expect(mockProductRepository.create).toHaveBeenCalledWith(productDto);
  });

  it('should find a product by id', async () => {
    const productDto = {
      product_name: 'John Doe',
      description: '123',
      price: 10,
      photo_url: '',
      product_category_id: '2',
      quantity: 3,
      seller_id: '3'
    };
    expect(await service.findOne('1')).toEqual({
      id: '1',
      ...productDto,
      reviews: [{ score: 5 }, { score: 3 }] // Simulando algunas reseñas
    });
  });

  it('should find all products', async () => {

    const meta: PageMetaDto = {
      itemCount: 0, 
      hasNextPage: false,
      hasPreviousPage:false,
      page: 1,
      pageCount: 0,
      take: 10
    }

    expect(await service.find(new PageOptionsDto())).toEqual({
      data: [],
      meta
    });
  });

  it('should remove a product', async () => {
    expect(await service.remove('1')).toEqual(undefined);
  });

  it('should update a product', async () => {
    const productDto = {
      product_name: 'John Doe',
      description: '123',
      price: 10,
      photo_url: [''],
      product_category_id: '2',
      quantity: 3,
      seller_id: '3'
    };
    expect(await service.update('1', productDto)).toEqual({
      id: '1',
      ...productDto
    });
  });

  it('should find filtered products', async () => {
    const data = {
      category : null,
      priceMin : null,
      priceMax : null,
      search : null
    }
    expect(await service.findFiltered(data)).toEqual([]);
  });
  it('should calculate total score', async () => {
    expect(await service.calculateTotalScore('1')).toEqual(4); // (5 + 3) / 2 = 4
  });
});
