import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class PaymentMethod{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    payment_name:string;

    @OneToMany(()=>Order, (order)=>order.payment_method)
    orders: Order;

}