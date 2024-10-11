import { Product } from "../../products/entities/products.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class Review {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('numeric',{
        nullable:false
    })
    score: number;

    @Column('text', {
        nullable: true
    })
    comment?: string;

    @ManyToOne(()=>User, (customer)=>customer.reviews)
    customer:User;

    @ManyToOne(()=>Product, (product)=>product.reviews)
    product: Product;
}
