import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { ConfigModule } from '@nestjs/config';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';
import { User } from '../users/entities/user.entity';
import { City } from './entities/city.entity';
import { Department } from './entities/department.entity';
import { CityService } from './services/city.service';
import { DepartmentService } from './services/department.service';
import { Order } from '../orders/entities/order.entity';
import { DepartmentController } from './controllers/department.controller';
import { CityController } from './controllers/city.controller';

@Module({
  controllers: [AddressController, DepartmentController, CityController],
  providers: [AddressService, CityService, DepartmentService],
  exports: [AddressModule, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Address, City, Department, User, Order]), 
    ConfigModule
  ]
})
export class AddressModule {}

