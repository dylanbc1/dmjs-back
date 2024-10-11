import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/products/entities/products.entity';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  const mockProduct = {
    product_name: 'John Doe',
    description: '123',
    price: 10,
    photo_url: '',
    product_category_id: '',
    quantity: 1,
    seller_id: ''
}
  const mockProductRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((product) => Promise.resolve({id: '1', ...product})),
    find: jest.fn().mockResolvedValue(mockProduct)
  } 

  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(getRepositoryToken(Product)).useValue(mockProductRepository).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/products (GET)', () => {
    // return request(app.getHttpServer())
    //   .get('/products')
    //   .expect(200)
    //   .expect(mockProduct)

      
  });

  // it('/products (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/products')
  //     .send({
  //       product_name: 'John Doe',
  //       description: '123',
  //       price: 10,
  //       photo_url: '',
  //       product_category_id: 'd5f7f630-bf55-4e0b-bb09-107e0411d1de',
  //       size: Size.M
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(201)
      
  // })

  it('/products (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({name: 12331231})
      .expect('Content-Type', /json/)
      .expect(400)
      
  })

});
