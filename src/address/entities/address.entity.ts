import { Order } from "../../orders/entities/order.entity";
import { User } from "../../users/entities/user.entity";
import { City } from "../entities/city.entity"
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Address{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:true
    })
    street:string;

    @Column('text',{
        nullable:true
    })
    avenue:string

    @Column('text',{
        nullable:false
    })
    house_number:string

    @ManyToOne(()=>User, (user)=> user.addresses)
    user: User;

    @ManyToOne(() => City, (city) => city.addresses)
    city: City;

    @OneToMany(() => Order, (order) => order.address)
    orders: Order[];
}