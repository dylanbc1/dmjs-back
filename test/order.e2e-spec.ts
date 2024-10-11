import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/entities/roles.enum';
import { Status } from '../src/orders/entities/status.enum';
import { Order } from '../src/orders/entities/order.entity';

describe('OrderController (e2e)', () => {
  let app: INestApplication;

  const mockOrders ={status: Status.SENDED,
    date: new Date('2024-06-16').toISOString(),
    customer_id: '',
    seller_id: '',
    payment_method_id: '',
    address_id:'',
  }

  const mockOrdersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((order) => Promise.resolve({id: '1', ...order})),
    find: jest.fn().mockResolvedValue(mockOrders)
  } 
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(getRepositoryToken(Order)).useValue(mockOrdersRepository).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  //it('/orders (GET)', () => {
    // return request(app.getHttpServer())
    //   .get('/orders')
    //   .expect(200)
    //   .expect(mockOrders)

      
  //});

  /*
  it('/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send({Status: Status.SENDED,
        date: new Date('2024-06-16'),
        customer_id: '',
        payment_method_id: ''})
      .expect('Content-Type', /json/)
      .expect(201)
      
  })
      */

  it('/orders (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send({name: 12331231})
      .expect('Content-Type', /json/)
      .expect(400)
      
  })

});
