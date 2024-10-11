import { IsBoolean, IsString } from "class-validator";

export class CreateCommentDto {

    @IsString()
    description:string;

    @IsString()
    user_id:string;

    @IsString()
    product_id:string;

}
