import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import nodemailer from 'nodemailer'
import { from } from 'rxjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>  
  ) {}

  

  async signIn(email: string, password: string) {
      const user = await this.usersService.findByEmail(email);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      //console.log(user)

      const payload = {id: user.id, email: user.email, name: user.name, role: user.role};
      return {
        ...payload,
        token: await this.jwtService.signAsync(payload)
      }
  }

  async sendMail(email:string){
    const user = await this.usersService.findByEmail(email);

    if(!user) throw new NotFoundException(`The user with email ${email} not fund`)

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
                <h1 >¡Hola, ${user.name}!</h1>
                <h3 font-weight: bold;">¡Entra al siguiente enlace para recuperar tu contraseña!</h3>
                
            </div>

            <div style="padding: 20px; background-color: #f5f5f5; color: black; text-align: center; margin: 0 auto; max-width: 600px;">
                <p> ${process.env.FRONT_URL}/auth/forgot/${user.id}</p>
                <h2 style="margin-top: 20px;">Gracias por tu confiar en nuestra pagina!</h2>
                <img src="/images/logo-no-slogan.png" alt="DMajorStore Logo" width="96" height="96" class="mt-4 w-20 h-20">
            </div>
            <div style="color: #fff; text-align: center; margin: 0 auto; max-width: 600px; padding-top: 20px;">
                <p>-------------------------</p>
            </div>
        </body>
        </html>
        `;
    
    

    sendSmtpEmail.sender = { "name": "DMajorstore", "email": "noreply@dmajorstore.online"};
    sendSmtpEmail.to = [
      { "email": user.email , "name": user.name } 
    ];
    sendSmtpEmail.replyTo = { "email":  user.email, "name":  user.name };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = { "parameter": "My param value", "subject": "¡Perdiste tu contraseña, no te preocupes!" };
    
    
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });
  }

  async changePassword(id:string, password:string){
    let user = await this.userRepository.findOne({
      where: {id:id},
      
    })

    if(!user) throw new NotFoundException(`User Not fund`)

    if (typeof password !== 'string') {
      throw new Error('Password must be a string');
    }

    user.password = bcrypt.hashSync(password, 10);

    this.userRepository.save(user);

  }
  


}
