import { Column, Entity, Long, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/products.entity";

@Entity()
export class OrderDetail {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('numeric', {
        nullable:false,
        default: 1
    })
    quantity:number;

    @ManyToOne(()=>Order, (order)=>order.order_details)
    order:Order;

    @ManyToOne(()=>Product, (product)=>product.order_details)
    product: Product
}