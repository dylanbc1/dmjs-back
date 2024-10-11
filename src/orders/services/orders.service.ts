import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { PaymentMethod } from '../entities/payment_method';
import { PageOptionsDto } from '../../pagination/page-options.dto';
import { PageDto } from '../../pagination/page.dto';
import { PageMetaDto } from '../../pagination/page-meta.dto';
import { Address } from '../../address/entities/address.entity';
import { Product } from '../../products/entities/products.entity';

@Injectable()
export class OrdersService {

  private readonly logger = new Logger('OrderService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentMethod)
    private readonly paymentRepository: Repository<PaymentMethod>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ){}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);

    const address = await this.addressRepository.findOne({where:{id:createOrderDto.address_id}});

    if(!address) throw new NotFoundException(`address with id ${createOrderDto.address_id} doesn't exist`);

    const user = await this.userRepository.findOne({where:{id:createOrderDto.customer_id}})

    if(!user) throw new NotFoundException(`user with id ${createOrderDto.customer_id} doesn't exist`)

    const payment_method = await this.paymentRepository.findOne({where:{id:createOrderDto.payment_method_id}})

    if(!payment_method) throw new NotFoundException(`payment method with id ${createOrderDto.payment_method_id} doesn't exist`)

    order.customer = user;
    order.payment_method = payment_method;
    order.address = address;

    await this.orderRepository.save(order)

    return order;
  }

  async findAll(pageOptionsDto: PageOptionsDto):Promise<PageDto<Order>> {
    const [data, itemCount] = await this.orderRepository.findAndCount({
      relations: ['customer', 'payment_method', 'address'],
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      order:{
        id: pageOptionsDto.order
      }
    })

    const pageMetaDto = new PageMetaDto({pageOptionsDto, itemCount})
    return new PageDto(data, pageMetaDto)
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne(
      {
        where:{id:id},
        relations: ['order_details','order_details.product','customer', 'payment_method', 'address'],
      }
    );
    if(!order) throw new NotFoundException(`the order with ${id} not found`)
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id:id,
      ...updateOrderDto
    })

    if(!order) throw new NotFoundException(`order with id ${id} doesn't exist`)

    try{
      await this.orderRepository.save(order)
      return order;
    }catch(error){

    }
  }

  async remove(id: string) {
    const order = await this.findOne(id)

    await this.orderRepository.remove(order)
  }

  async findSellerOrders(seller_id: string){
    const orders = await this.orderRepository.createQueryBuilder('order')
    .leftJoinAndSelect('order.order_details', 'order_detail')
    .leftJoinAndSelect('order_detail.product', 'product')
    .where('product.sellerId = :sellerId', { sellerId: seller_id })
    .getMany();

    
    return orders;
  }
}
