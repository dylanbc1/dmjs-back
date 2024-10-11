import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderDetail } from "../entities/order_detail.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDetailDto } from "../dto/create-order_detail.dto";
import { Order } from "../entities/order.entity";
import { NotFoundError } from "rxjs";
import { Product } from "../../products/entities/products.entity";
import { UpdateOrderDetailDto } from "../dto/update_order_detail.dto";

@Injectable()
export class OrderDetailService {
    constructor(
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository : Repository<Product>
    ){}


    async create(createOrderDetailDto: CreateOrderDetailDto){
        try{
            const orderDetail = this.orderDetailRepository.create(createOrderDetailDto);
            const order = await this.orderRepository.findOne({where:{id: createOrderDetailDto.order_id}});
            if(!order) throw new NotFoundException(`order with id ${createOrderDetailDto.order_id} not found`);
            const product = await this.productRepository.findOne({where:{id:createOrderDetailDto.product_id}});
            if(!product) throw new NotFoundException(`product with id ${createOrderDetailDto.product_id} not found`)
            orderDetail.order = order;
            orderDetail.product = product;
            
            await this.orderDetailRepository.save(orderDetail);
            return orderDetail
        }catch(error){
            throw error;
        }
    }

    async find(){
        return await this.orderDetailRepository.find(
            {
                relations: ['order', 'product'],
            }
        )
    }

    async findOne(id:string){
        const orderDetail = this.orderDetailRepository.findOne({
            where: {id: id},
            relations: ['order', 'product'],
        })

        if(!orderDetail) throw new NotFoundException(`orderDetail with id ${id} not fund`)

        return orderDetail;
    }

    async update(id:string, updateOrderDetailDto: UpdateOrderDetailDto){
        const orderDetail = await this.orderDetailRepository.preload({
            id:id,
            ...updateOrderDetailDto
        })

        if(!orderDetail) throw new NotFoundException(`orderDetail with id ${id} not fund`)
        
        try{
            await this.orderDetailRepository.save(orderDetail)
            return orderDetail
        }catch(error){
            throw error
        }
        
    }

    async remove(id:string){
        const orderDetail = await this.findOne(id);
        await this.orderDetailRepository.remove(orderDetail)
    }

}