import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products.entity";

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    category: string;

    @OneToMany(()=>Product, (product)=>product.product_category)
    products: Product[];
}