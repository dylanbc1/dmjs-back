import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { Order } from '../orders/entities/order.entity';
import { Comment } from '../resources/entities/comment.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/products.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, Repository],
  exports: [UsersService, UsersModule, TypeOrmModule],
  imports: [forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Address, Order, Comment, User, Product]), 
    ConfigModule
  ]
})
export class UsersModule {}
