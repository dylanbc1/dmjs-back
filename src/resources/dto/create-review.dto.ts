import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReviewDto {
    
    @IsNumber()
    score:number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsString()
    user_id:string;

    @IsString()
    product_id:string;
}
