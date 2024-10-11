import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductCategoryDto{

    @IsString()
    category: string;
}