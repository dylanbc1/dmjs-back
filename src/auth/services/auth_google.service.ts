import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";
import { Role } from "../../users/entities/roles.enum";




@Injectable()
export class AuthGoogleService {

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly customerRepository: Repository<User>,
        private readonly userService: UsersService
    ){}

    async oAuthLogin(user) {

        if (!user) {
          throw new Error('User not found!!!');
        }
    
        const email = user.email

        //console.log(email)

        const userExist = await this.customerRepository.findOne({
            where : {email},
            select : {id:true, email:true, password:true}
        })   

        if(!userExist){
            let customer = new CreateUserDto();
            customer.name = user.name;
            customer.email = email;
            customer.photo_url = user.picture;
            customer.password = process.env.GOOGlE_PASSWORD
            customer.role = Role.USER
            const users = await this.userService.create(customer);
        }

        const createdtUser = await this.customerRepository.findOne({
            where : {email},
            select : {id:true, email:true, password:true},
        })

        let payload;

        if(userExist){
            payload = {
              id : userExist.id,
              email: user.email,
              name: user.name,
              role: userExist.role
            };
          }else{
            payload = {
              id : createdtUser?.id,
              email: user.email,
              name: user.name,
              role: createdtUser?.role
            };
          }
    
          return {
            ...payload,
            token : this.jwtService.sign({id: payload.id})
          }
      }

}