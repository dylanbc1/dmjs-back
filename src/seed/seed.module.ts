import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../address/entities/department.entity';
import { City } from '../address/entities/city.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/roles.enum';
import * as bcrypt from 'bcrypt';
import { Address } from '../address/entities/address.entity';
import { PaymentMethod } from '../orders/entities/payment_method';
import { Order } from '../orders/entities/order.entity';
import { Status } from '../orders/entities/status.enum';
import { ProductCategory } from '../products/entities/product-category.entity';
import { Product } from '../products/entities/products.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { Comment } from '../resources/entities/comment.entity';
import { Review } from '../resources/entities/review.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([City, Department, User, Address,PaymentMethod, Order, ProductCategory, Product, OrderDetail, Comment,Review])
  ],
  exports: [SeedModule]
})
export class SeedModule {}
