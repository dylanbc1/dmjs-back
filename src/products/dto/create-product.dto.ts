import { IsNumber, IsOptional, IsString, IsArray } from "class-validator";

export class CreateProductDto {

    @IsString()
    product_name:string;

    @IsString()
    @IsOptional()
    description:string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsArray()
    @IsString({ each: true })
    photo_url:string[];

    @IsString()
    product_category_id:string;

    @IsString()
    seller_id:string;
}
