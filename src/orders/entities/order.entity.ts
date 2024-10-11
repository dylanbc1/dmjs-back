import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "./payment_method";
import { OrderDetail } from "./order_detail.entity";
import { Status } from "./status.enum";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('enum', {
        enum: Status,
        nullable:false
    })
    status:Status;

    @Column('date', {
        nullable:false
    })
    date:Date;

    @ManyToOne(()=>User, (customer) => customer.orders)
    customer:User;

    @ManyToOne(()=>PaymentMethod, (payment_method)=> payment_method.orders)
    payment_method: PaymentMethod;

    @OneToMany(()=>OrderDetail, (order_detail)=>order_detail.order)
    order_details: OrderDetail[];
    
    @ManyToOne(() => Address, (address) => address.orders)
    address: Address;
}
