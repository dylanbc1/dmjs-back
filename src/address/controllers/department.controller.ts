import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  findAll(){
    return this.departmentService.find()
  }

  @Get(':id')
  findOne(@Param('id') id:string){
    return this.departmentService.findOne(id)
  }

}
