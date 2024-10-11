import { IsString } from "class-validator";


export class CreatePaymentDto{

    @IsString()
    payment_name:string;
}