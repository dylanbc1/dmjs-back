import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDetailDto } from "./create-order_detail.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto){
    @IsString()
    @IsOptional()
    id?:string;
}