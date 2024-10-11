import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './services/product-category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;

  const mockProductCategoryRepository = {
    create: jest.fn().mockImplementation(category => Promise.resolve({ id: '1', ...category })),
    save: jest.fn().mockImplementation(category => Promise.resolve({ id: '1', ...category })),
    findOne: jest.fn().mockImplementation(id => Promise.resolve({
      id: '1',
      category: 'Electronics',
      products: []
    })),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
    remove: jest.fn().mockImplementation(id => Promise.resolve({
      id: id,
      category: 'Electronics',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockProductCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product category record and return that', async () => {
    const categoryDto: CreateProductCategoryDto = {
      category: 'Electronics'
    };

    expect(await service.create(categoryDto)).toEqual({
      id: '1',
      category: 'Electronics'
    });

    expect(mockProductCategoryRepository.create).toHaveBeenCalledWith(categoryDto);
    expect(mockProductCategoryRepository.save).toHaveBeenCalledWith({
      id: '1',
      category: 'Electronics'
    });
  });

  it('should find all product categories', async () => {
    expect(await service.find()).toEqual([]);
    expect(mockProductCategoryRepository.find).toHaveBeenCalledWith({
      relations: ['products']
    });
  });

  it('should find a product category by id', async () => {
    const categoryDto = {
      id: '1',
      category: 'Electronics',
      products: []
    };
    expect(await service.findOne('1')).toEqual(categoryDto);
    expect(mockProductCategoryRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['products']
    });
  });

  it('should remove a product category', async () => {
    expect(await service.remove('1')).toEqual(undefined);
    expect(mockProductCategoryRepository.remove).toHaveBeenCalledWith({
      id: '1',
      category: 'Electronics',
      products: []
    });
  });
});
