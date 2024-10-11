import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-adress.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('address')
@ApiTags('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() CreateAddressDto:CreateAddressDto){
    return this.addressService.create(CreateAddressDto);
  }

  @Get()
  findAll(){
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:string){
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id:string, @Body() updateAddressDto: UpdateAddressDto){
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id:string){
    this.addressService.remove(id);
  }

}
