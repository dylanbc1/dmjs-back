import { IsNumber, IsString } from "class-validator";


export class CreateOrderDetailDto {

    @IsNumber()
    quantity:number;

    @IsString()
    order_id:string;

    @IsString()
    product_id:string;

}