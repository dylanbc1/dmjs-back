import { IsDate, IsNumber, IsString } from "class-validator";
import { Status } from "../entities/status.enum";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsString()
    status:Status;

    @Type(()=>Date)
    @IsDate()
    date:Date;

    @IsString()
    customer_id:string;

    @IsString()
    payment_method_id:string;

    @IsString()
    address_id:string;
}
