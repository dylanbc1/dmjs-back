import { InjectRepository } from "@nestjs/typeorm";
import { PaymentMethod } from "../entities/payment_method";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentMethod)
        private readonly paymentRepositoy: Repository<PaymentMethod>
    ){}

    async create(createpaymentDto: CreatePaymentDto){
        const payment = this.paymentRepositoy.create(createpaymentDto)

        await this.paymentRepositoy.save(payment);

        return payment;
    }
}