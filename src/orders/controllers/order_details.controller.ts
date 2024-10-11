import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { OrderDetailService } from "../services/order_detail.service";
import { CreateOrderDetailDto } from "../dto/create-order_detail.dto";
import { UpdateOrderDetailDto } from "../dto/update_order_detail.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller('orderDetails')
@ApiTags('orderDetails')
export class OrderDetailController{
    constructor(
        private readonly orderDetailService: OrderDetailService
    ){}

    @Post()
    async create(@Body() CreateOrderDetailDto: CreateOrderDetailDto ){
        return await this.orderDetailService.create(CreateOrderDetailDto);
    }

    @Get()
    async findAll(){
        return await this.orderDetailService.find()
    }

    @Get(':id')
    async findOne(@Param('id') id:string){
        return await this.orderDetailService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() UpdateOrderDetailDto: UpdateOrderDetailDto){
        return await this.orderDetailService.update(id, UpdateOrderDetailDto);
    }

    @Delete(':id')
    async remove(@Param('id') id:string){
        return await this.orderDetailService.remove(id);
    }
}