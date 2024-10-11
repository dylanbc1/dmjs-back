import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductCategoryService } from './services/product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { Role } from '../users/entities/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  let service: ProductCategoryService;

  const mockProductCategoryService = {
    create: jest.fn(dto => Promise.resolve({ id: '1', ...dto })),
    find: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(id => Promise.resolve({ id, category: 'Electronics', products: [] })),
    remove: jest.fn(id => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        {
          provide: ProductCategoryService,
          useValue: mockProductCategoryService,
        },
        JwtService, ConfigService
      ],
    }).compile();

    controller = module.get<ProductCategoryController>(ProductCategoryController);
    service = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product category', async () => {
    const categoryDto: CreateProductCategoryDto = {
      category: 'Electronics',
    };

    expect(await controller.create(categoryDto)).toEqual({
      id: '1',
      category: 'Electronics',
    });

    expect(mockProductCategoryService.create).toHaveBeenCalledWith(categoryDto);
  });

  it('should find all product categories', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(mockProductCategoryService.find).toHaveBeenCalled();
  });

  it('should find a product category by id', async () => {
    const categoryDto = {
      id: '1',
      category: 'Electronics',
      products: [],
    };
    expect(await controller.findOne('1')).toEqual(categoryDto);
    expect(mockProductCategoryService.findOne).toHaveBeenCalledWith('1');
  });

  it('should delete a product category', async () => {
    expect(await controller.delete('1')).toEqual(undefined);
    expect(mockProductCategoryService.remove).toHaveBeenCalledWith('1');
  });
});
