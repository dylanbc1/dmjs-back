import { Injectable } from "@nestjs/common";
import { Order } from "../entities/order.entity";
import { OrdersService } from "./orders.service";
import { OrderDetail } from "../entities/order_detail.entity";
import { Or, Repository } from "typeorm";
import axios from "axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "../entities/status.enum";
import { Product } from "../../products/entities/products.entity";

@Injectable()
export class PaypalService {

    constructor(
        private readonly orderService: OrdersService,
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository : Repository<Product>
    ){}

    async createPayment(order_id:string){
        
        const order = await this.orderService.findOne(order_id);
        if (!order) {
            throw new Error('Order not found');
        }

        let totalPrice = 0;

        const orderDetails = order.order_details;

        if (orderDetails && typeof orderDetails[Symbol.iterator] === 'function') {
          for (const orderDetail of orderDetails) {
            const productPrice = orderDetail.product.price;
            const quantity = orderDetail.quantity;
            totalPrice += productPrice * quantity;
          }
        }
        

        const paypal_order = {
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: totalPrice,
                },
              },
            ],
            application_context: {
              brand_name: "mycompany.com",
              landing_page: "NO_PREFERENCE",
              user_action: "PAY_NOW",
              return_url: process.env.BACK_URL+`/paypal/capture/${order_id}`,
              cancel_url: process.env.BACK_URL+`/paypal/cancel/${order_id}`,
            },
          };

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

       const {data:{access_token}} = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        })
        //console.log(access_token)
        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, paypal_order,{
            headers: { Authorization: `Bearer ${access_token}` }
        })

        //console.log(response.data)

        const url = response.data.links[1]
        //console.log(url)
        return url
        
    }


    async capturePayment(order_id:string, token:any){

        const order = await this.orderService.findOne(order_id);

        const orderDetails = order.order_details;

        for(const order_detail of orderDetails){
          const product = await this.productRepository.findOne({where : {id: order_detail.product.id}})
          if(product){
            product.quantity = product.quantity - order_detail.quantity;
            await this.productRepository.save(product);
          }
          
        }
        const response = await axios.post(
            `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
              auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
              },
            }
        );

        order.status = Status.RECEIVED;

        await this.orderRepository.save(order)
        const brevo = require('@getbrevo/brevo');
        let apiInstance = new brevo.TransactionalEmailsApi();
        
        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = `${process.env.BREVO_API}`;
        
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = "{{params.subject}}";
        sendSmtpEmail.htmlContent = `
        <html>
            <body>
            <div style="font-family: Arial, sans-serif; color: #fff;">
            <div style="text-align: center; padding: 20px; background-color: #b4b4e2;">
                <h1 >¡Hola, ${order.customer.name}!</h1>
                <h3 font-weight: bold;">¡Esperamos que estes tan emocionad@ como nosotros por tu nueva compra!</h3>
                
            </div>

            <div style="padding: 20px; background-color: #f5f5f5; color: black; text-align: center; margin: 0 auto; max-width: 600px;">
                <h2 >Pedido #${order.id}</h2>
                <h3 >Fecha: ${order.date}</h3>
                <h2 >Resumen</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 8px; text-align: left;">Producto</th>
                        <th style="padding: 8px; text-align: left;">Cantidad</th>
                        <th style="padding: 8px; text-align: left;">Total</th>
                    </tr>
                    ${order.order_details.map(detail => `
                        <tr>
                            <td style="padding: 8px;">${detail.product.product_name}</td>
                            <td style="padding: 8px;">${detail.quantity}</td>
                            <td style="padding: 8px;">$${detail.product.price * detail.quantity}</td>
                            
                        </tr>
                    `).join('')}
                </table>
                <p style="color: #f0f; font-weight: bold;">Recuerda que tu pedido llegará de 5 a 8 días hábiles después de realizada la compra.</p>
                <h2 style="margin-top: 20px;">Gracias por tu compra!</h2>
                <img src="" alt="DMajorStore Logo" width="96" height="96" class="mt-4 w-20 h-20">
            </div>
            <div style="color: #fff; text-align: center; margin: 0 auto; max-width: 600px; padding-top: 20px;">
                <p>-------------------------</p>
            </div>
        </body>
        </html>
        `;
        sendSmtpEmail.sender = { "name": "DMajorstore", "email": "noreply@dmajorstore.online"};
        sendSmtpEmail.to = [
          { "email": order.customer.email , "name": order.customer.name } 
        ];
        sendSmtpEmail.replyTo = { "email":  order.customer.email, "name":  order.customer.name };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": "My param value", "subject": "¡Hemos recibido tu pedido!" };
        
        
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
          console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
          
        });
        return response.data
        //console.log(response.data);
    }

    async cancel(order_id:string){
        const order = await this.orderService.findOne(order_id);
        order.status = Status.CANCELLED;

        await this.orderRepository.save(order)
    }
}