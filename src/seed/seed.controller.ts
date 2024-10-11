import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AnyARecord } from 'dns';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  create(@Body() createSeedDto: any) {
    return this.seedService.seed();
  }
  
  
}
