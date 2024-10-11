import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "../entities/city.entity"

@Entity()
export class Department{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        nullable:false
    })
    name: string;

    @OneToMany(() => City, (city) => city.department)
    cities: City[];
}