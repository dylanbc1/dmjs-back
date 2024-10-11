import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order_detail.entity';
import { PaymentMethod } from './entities/payment_method';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/products.entity';
import { Repository } from 'typeorm';
import { UsersModule } from '../users/users.module';
import { PaymentService } from './services/payment_method.service';
import { PaymentController } from './controllers/payment.controller';
import { PaypalController } from './controllers/paypal.controller';
import { PaypalService } from './services/paypal.service';
import { OrderDetailController } from './controllers/order_details.controller';
import { OrderDetailService } from './services/order_detail.service';
import { Address } from '../address/entities/address.entity';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([OrderDetail]),
    TypeOrmModule.forFeature([PaymentMethod]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Address]),
    Repository, 
    UsersModule
  ],
  controllers: [OrdersController, PaymentController, PaypalController, OrderDetailController],
  providers: [OrdersService, PaymentService, PaypalService, OrderDetailService],
  exports: [OrdersModule, TypeOrmModule, Repository]
})
export class OrdersModule {}
