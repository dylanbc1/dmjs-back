import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CityService {

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>
  ) {}

  async find(){
    return await this.cityRepository.find({
      relations: ['department']
    })
  }

  async findOne(id:string){
    return await this.cityRepository.findOne({
      where:{id},
      relations: ['department']
    })
  }

}
