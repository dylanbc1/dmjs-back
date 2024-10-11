import { Review } from "../../resources/entities/review.entity";
import { OrderDetail } from "../../orders/entities/order_detail.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./product-category.entity";
import { Comment } from "../../resources/entities/comment.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    product_name:string;

    @Column('text',{
        nullable:true
    })
    description:string;

    @Column('numeric', {
        nullable:false
    })
    price: number;

    @Column('text', {
        array: true,
        nullable: false,
        default: [],
    })
    photo_url:string[];

    @Column('numeric', {nullable: false})
    quantity: number;

    @OneToMany(()=>OrderDetail, (order_detail)=>order_detail.product, {nullable: true})
    order_details?: OrderDetail[];

    @OneToMany(()=>Review, (reviews)=>reviews.product, {nullable: true})
    reviews?: Review[];

    @ManyToOne(()=>ProductCategory, (product_type)=>product_type.products, {nullable: false})
    product_category: ProductCategory;

    @OneToMany(()=>Comment, (comment)=>comment.product, {nullable: true})
    comments?: Comment[];

    @ManyToOne(() => User, (seller) => seller.products)
    seller: User;
}
