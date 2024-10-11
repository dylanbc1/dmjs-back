import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-adress.dto';
import { User } from '../../users/entities/user.entity';
import { City } from '../entities/city.entity';

@Injectable()
export class AddressService {

  private readonly logger = new Logger('AdressService');

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>
  ) {}

  async create(createAddressDto: CreateAddressDto){
    const address = await this.addressRepository.create(createAddressDto);

    const user = await this.userRepository.findOne({where: {id: createAddressDto.user_id}})

    if(!user)  throw new NotFoundException(`user not fund`)

    const city = await this.cityRepository.findOne({where: {id: createAddressDto.city_id}})

    if(!city) throw new NotFoundException(`city not fund`)

    address.user = user
    address.city = city

    await this.addressRepository.save(address);

    return address;
  }

  async findAll(){
    const adress:Address[] = await this.addressRepository.find({
      relations: ['user', 'city']
    });

    return adress;

  }

  async findOne(id:string){
    const address = await this.addressRepository.findOne({
      where:{id:id}, 
      relations: ['user', 'city']
    });

    if(!address) throw new NotFoundException(`address with id ${id} not found`)
    return address;
  }

  async update(id:string, updateAddressDto: UpdateAddressDto){
    const address = await this.addressRepository.preload({
      id:id,
      ...updateAddressDto
    })

    if(!address) throw new NotFoundException(`The adress with ${id} doesn't exist`)

    try{
      await this.addressRepository.save(address)
      return address
    }catch(error){
      throw error
    }

    
  }

  async remove(id:string){
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }

  /*
  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
    */
  
  

}
