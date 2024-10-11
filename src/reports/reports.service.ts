import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { subDays, format } from 'date-fns';
import { Status } from '../orders/entities/status.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getIncomeReport(): Promise<any> {
    const currentDate = new Date();
    const lastMonthDate = subDays(currentDate, 30);
    const lastMonthDatePrev = subDays(lastMonthDate, 30);

    const currentPeriodOrders = await this.ordersRepository.find({
      where: {
        date: Between(lastMonthDate, currentDate),
        status: Status.RECEIVED,
      },
      relations: ['order_details', 'order_details.product', 'order_details.product.product_category'],
    });

    const lastPeriodOrders = await this.ordersRepository.find({
      where: {
        date: Between(lastMonthDatePrev, lastMonthDate),
        status: Status.RECEIVED,
      },
      relations: ['order_details', 'order_details.product', 'order_details.product.product_category'],
    });

    const calculateIncome = (orders: Order[]) => {
      return orders.reduce((total, order) => {
        const orderIncome = order.order_details.reduce((orderTotal, detail) => {
          return orderTotal + Number(detail.quantity) * Number(detail.product.price);
        }, 0);
        return total + orderIncome;
      }, 0);
    };

    const calculateCategorySales = (orders: Order[]) => {
      const categorySales = new Map<string, number>();
      orders.forEach(order => {
        order.order_details.forEach(detail => {
          const categoryName = detail.product.product_category.category;
          const salesAmount = Number(detail.quantity) * Number(detail.product.price);
          if (categorySales.has(categoryName)) {
            categorySales.set(categoryName, categorySales.get(categoryName) + salesAmount);
          } else {
            categorySales.set(categoryName, salesAmount);
          }
        });
      });
      return Array.from(categorySales.entries()).map(([category, sales]) => ({ category, sales }));
    };

    const getTopCategories = (categorySales, topN = 3) => {
      const sortedSales = categorySales.sort((a, b) => b.sales - a.sales);
      const topCategories = sortedSales.slice(0, topN);
      const otherCategories = sortedSales.slice(topN);
      const othersSales = otherCategories.reduce((total, category) => total + category.sales, 0);
      if (othersSales > 0) {
        topCategories.push({ category: 'Others', sales: othersSales });
      }
      return topCategories;
    };

    const currentPeriodIncome = calculateIncome(currentPeriodOrders);
    const lastPeriodIncome = calculateIncome(lastPeriodOrders);
    const incomeChange = ((currentPeriodIncome - lastPeriodIncome) / lastPeriodIncome) * 100;

    const currentPeriodCategorySales = calculateCategorySales(currentPeriodOrders);
    const topCategories = getTopCategories(currentPeriodCategorySales);

    const fillMissingDays = (startDate: Date, endDate: Date, orders: Order[]) => {
      const daysArray = [];
      for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        const dateStr = format(dt, 'yyyy-MM-dd');
        const dailyIncome = orders
          .filter(order => format(order.date, 'yyyy-MM-dd') === dateStr)
          .reduce((total, order) => {
            const orderIncome = order.order_details.reduce((orderTotal, detail) => {
              return orderTotal + Number(detail.quantity) * Number(detail.product.price);
            }, 0);
            return total + orderIncome;
          }, 0);
        daysArray.push({ date: dateStr, income: dailyIncome });
      }
      return daysArray;
    };

    const ordersDays = fillMissingDays(lastMonthDate, currentDate, currentPeriodOrders);

    return {
      currentPeriod: {
        income: currentPeriodIncome,
      },
      lastPeriod: {
        income: lastPeriodIncome,
      },
      incomeChange: incomeChange / 100, // Convert to decimal
      ordersDays: ordersDays,
      topCategories: topCategories,
    };
  }

  async getRegistrationStats() {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setDate(currentDate.getDate() - 30);
    const previousMonthDate = new Date(lastMonthDate);
    previousMonthDate.setDate(lastMonthDate.getDate() - 30);

    // Get registrations for the current period
    const currentPeriodUsers = await this.usersRepository.count({
        where: {
            created_at: Between(lastMonthDate, currentDate),
        },
    });

    // Get registrations for the previous period
    const previousPeriodUsers = await this.usersRepository.count({
        where: {
            created_at: Between(previousMonthDate, lastMonthDate),
        },
    });

    // Calculate the percentage change
    const percentageChange = previousPeriodUsers === 0 ? 0 : ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100;
    
    return {
        totalRegistrations: currentPeriodUsers,
        percentageChange: percentageChange,
    };
  }

  async getOrderStats() {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setDate(currentDate.getDate() - 30);
    const previousMonthDate = new Date(lastMonthDate);
    previousMonthDate.setDate(lastMonthDate.getDate() - 30);

    // Get registrations for the current period
    const currentPeriodUsers = await this.ordersRepository.count({
        where: {
            date: Between(lastMonthDate, currentDate),
        },
    });

    // Get registrations for the previous period
    const previousPeriodUsers = await this.ordersRepository.count({
        where: {
            date: Between(previousMonthDate, lastMonthDate),
        },
    });

    // Calculate the percentage change
    const percentageChange = previousPeriodUsers === 0 ? 0 : ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100;
   
    return {
        totalOrders: currentPeriodUsers,
        ordersChange: percentageChange,
    };
  }
}
