import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response, request } from "express";
import { Order } from "../entities/order.entity";
import { PaypalService } from "../services/paypal.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('paypal')
@ApiTags('paypal')
export class PaypalController{

    constructor(
        private readonly paypalService:PaypalService
    ){}

    @Get('create/:order_id')
    async createOrder(@Req() req: Request, @Res() res: Response, @Param('order_id') order_id:string){
        const url = await this.paypalService.createPayment(order_id)
        res.redirect(url.href)
    }

    @Get('capture/:order_id')
    async captureOrder(@Req() req: Request, @Res() res: Response,@Param('order_id') order_id:string){
        const {token} = req.query;
        await this.paypalService.capturePayment(order_id, token)
        //front_url
        return res.redirect(process.env.FRONT_URL)
    }

    @Get('cancel/:order_id')
    async cancelOrder(@Req() req: Request, @Res() res: Response, @Param('order_id') order_id:string){
       await this.paypalService.cancel(order_id);
        //fron_url
        return res.redirect(process.env.FRONT_URL)
    }
}