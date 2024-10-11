import { IsOptional, IsString } from "class-validator";

export class CreateAddressDto{

    @IsString()
    @IsOptional()
    street:string

    @IsString()
    @IsOptional()
    avenue:string;

    @IsString()
    house_number:string;

    @IsString()
    user_id:string;

    @IsString()
    city_id:string;

}
