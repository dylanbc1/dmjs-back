import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProductsService = {
    create: jest.fn(dto => {
      return {
        id: 'uuid',
        ...dto
      }
    }),
    update: jest.fn().mockImplementation((id, dto)=>{
      return {
        id: id,
        ...dto
      }
    }),
    
    find: jest.fn().mockImplementation(()=>[]),
    findOne: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        product_name: 'John Doe',
      }
    }),
    remove: jest.fn().mockImplementation((id)=>{
      return {
        id: id,
        name: 'John Doe',
      }
    })
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {}, // Provide a mock implementation if needed
        },
        JwtService, Repository
      ],
    }).overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const productDto = {
        product_name: 'John Doe',
        description: '123',
        price: 10,
        photo_url: [''],
        product_category_id: '',
        quantity: 1,
        seller_id: ''
    }
    expect(controller.create(productDto))
    .toEqual({
      id: 'uuid',
      ...productDto
    })

    expect(mockProductsService.create).toHaveBeenCalledWith(productDto)
  })

  it('should update a product', async () => {
    const productDto = {
        product_name: 'John Doe',
        description: '123',
        price: 10,
        photo_url: [''],
        product_category_id: '',
        quantity: 4,
    }
    expect(controller.update('1', productDto))
    .toEqual({
      id: '1',
      ...productDto
    })

    expect(mockProductsService.update).toHaveBeenCalledWith('1', productDto)

   
  })

  it('should return all products', async () => {
    // expect(controller.findAll()).toEqual([])
    // expect(mockProductsService.find).toHaveBeenCalled()
  })

  it('should return a product', async () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      product_name: 'John Doe',
    })
    expect(mockProductsService.findOne).toHaveBeenCalledWith('1')
  })

  it('should delete a product', async () => {
    expect(controller.delete('1')).toEqual({
      id: '1',
      name: 'John Doe',
    })
    expect(mockProductsService.remove).toHaveBeenCalledWith('1')
  })

  

});