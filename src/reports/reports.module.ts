import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './reports.service';
import { ReportController } from './reports.controller';
import { Order } from '../orders/entities/order.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, User])],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportsModule],
})
export class ReportsModule {}
