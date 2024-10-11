import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, Or, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../../address/entities/address.entity";
import { Order } from "../../orders/entities/order.entity";
import { Comment } from "../../resources/entities/comment.entity";
import { Review } from "../../resources/entities/review.entity";
import { Role } from "./roles.enum";
import { Product } from "../../products/entities/products.entity";
import { UserStatus } from "./user-status.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    name:string;

    @Column('text',{
        nullable:false
    })
    password:string;

    @Column('text',{
        nullable:false
    })
    email:string;

    @Column('text',{
        nullable:false,
        default: Date.now()
    })
    created_at:Date;

    @Column('text',{
        
        nullable:false
    })
    role:Role;

    @Column('text', {nullable: false
        , default: UserStatus.ACTIVE
    })
    status: UserStatus

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Order, (order) => order.customer, {nullable: true})
    orders?: Order[];

    @OneToMany(() => Comment, (comment) => comment.customer)
    comments: Comment[];
    
    @OneToMany(() => Review, (review) => review.customer)
    reviews: Review[];

    @OneToMany(() => Product, (product) => product.seller, {nullable: true})
    products?: Product[];

    @Column('text', {
        nullable: false
    })
    photo_url: string;


    @ManyToMany(() => Product)
    @JoinTable()
    favorites: Product[];
}
