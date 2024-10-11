import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../entities/address.entity"
import { Department } from "../entities/department.entity"

@Entity()
export class City{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    name: string;

    @OneToMany(() => Address, (address) => address.city)
    addresses: Address[];

    @ManyToOne(() => Department, (dept) => dept.cities)
    department: Department;
}